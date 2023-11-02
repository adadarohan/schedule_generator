# Schedule Generator

Test it out at [illiniclassscheduler.com](https://www.illiniclassscheduler.com/)

## Frontend
Hosted on AWS CloudFront through S3 site hosting. 

To run the frontend, run the following commands - 
```
cd frontend
npm install
npm run dev
```

To deploy the frontend, run the following command - 

`npm run deploy`

This command builds the static files and uploads them to an S3 bucket using the AWS CLI. After running the command, go to AWS CloudFront and invalidate the deployment.

## Backend
The backend is hosted on AWS Lambda functions and called using AWS Lambda function URLs.

To deploy the backend, run the following command and replace `{directory}` with the name of the folder that you want to deploy.

```
cd backend
./deploy.sh {directory}
```

