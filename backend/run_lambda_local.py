from get_classes.lambda_function import lambda_handler

event = {
    'queryStringParameters' : {
        'dump' : 'true'
        }
    }

context = {}

print(lambda_handler(event, context))