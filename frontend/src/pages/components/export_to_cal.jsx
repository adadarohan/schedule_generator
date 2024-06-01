import ical from 'ical-generator';

const weekdays = { 'M': 'MO', 'T': 'TU', 'W': 'WE', 'R': 'TH', 'F': 'FR', 'S': 'SA', 'U': 'SU' };
const weekdayList = ['M', 'T', 'W', 'R', 'F', 'S', 'U'];

export function createIcalFile(schedule) {

  const calendar = ical({name: 'Fall 2024 Schedule'});
  const startTime = new Date();
  const endTime = new Date();
  endTime.setHours(startTime.getHours()+1);
  calendar.createEvent({
      start: startTime,
      end: endTime,
      summary: 'Example Event',
      description: 'It works ;)',
      location: 'my room',
      url: 'http://sebbo.net/'
  });

  return calendar.toString();
  
}

