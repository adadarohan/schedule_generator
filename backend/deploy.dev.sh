cd $1
pip install --target ./package -r requirements.txt
cd package
zip -r ../my_deployment_package.zip . -x ".env"
cd ..
zip my_deployment_package.zip lambda_function.py
aws lambda update-function-code --function-name dev_$1 --zip-file fileb://my_deployment_package.zip