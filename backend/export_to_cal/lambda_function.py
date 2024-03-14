import json
from ics import Calendar, Event
from datetime import datetime
from ics.grammar.parse import ContentLine
from dateutil.relativedelta import relativedelta
import pytz

weekdays = {
    'M':'MO',
    'T':'TU',
    'W':'WE',
    'R':'TH',
    'F':'FR',
    'S':'SA',
    'U':'SU'
}

weekday_list = ['M', 'T', 'W', 'R', 'F', 'S', 'U']

def create_ical_file(schedule) :
    c = Calendar()

    for class_ in schedule:
        e = Event()
        e.name = class_['class']['code'] + ' ' + class_['class']['number'] + ' ' + class_['type']
        e.geo = (class_['coordinates'][0], class_['coordinates'][1])
        e.location = class_['building_name'] + ' ' + class_['room_number']
        
        # Parse date and time strings into datetime objects
        start_date_obj = datetime.strptime(class_['start_date'], "%Y-%m-%d %H:%M:%S")
        end_date_obj = datetime.strptime(class_['end_date'], "%Y-%m-%d %H:%M:%S")
        start_time_obj = datetime.strptime(class_['start_time'], "%Y-%m-%d %H:%M:%S").time()
        end_time_obj = datetime.strptime(class_['end_time'], "%Y-%m-%d %H:%M:%S").time()

        # Set actual start date to be the nearest weekday speficied in the JSON
        days_index_list = [weekday_list.index(day) for day in class_['days']]
        possible_start_datetimes = []
        for day_index in days_index_list:
            possible_start_datetimes.append(start_date_obj + relativedelta(weekday=day_index))
        actual_start_date_obj = min(possible_start_datetimes)

        timezone = pytz.timezone("US/Central")

        # Combine date and time
        start_datetime = timezone.localize(datetime.combine(actual_start_date_obj.date(), start_time_obj))
        end_datetime = timezone.localize(datetime.combine(actual_start_date_obj.date(), end_time_obj))
        e.begin = start_datetime
        e.end = end_datetime


        #RRULE:FREQ=WEEKLY; DTSTART:20240116T000000;UNTIL=20240501T000000;BYDAY=MO,WE

        rrule_string = f"FREQ=WEEKLY; DTSTART={start_date_obj.strftime('%Y%m%dT%H%M%S')};UNTIL={end_date_obj.strftime('%Y%m%dT%H%M%S')};BYDAY={','.join([weekdays[day] for day in class_['days']])}"
        e.extra.append(ContentLine(name="RRULE", value=rrule_string))
        c.events.add(e)

    return {'ical': c.serialize()}


def lambda_handler(event, context):

    return json.dumps(create_ical_file(event["queryStringParameters"]['schedule']))