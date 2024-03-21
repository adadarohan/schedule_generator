wget https://downloads.python.org/pypy/pypy3.10-v7.3.14-linux64.tar.bz2
tar xf pypy3.10-v7.3.14-linux64.tar.bz2
./pypy3.10-v7.3.14-linux64/bin/pypy -m ensurepip
./pypy3.10-v7.3.14-linux64/bin/pypy -mpip install -U pip wheel
./pypy3.10-v7.3.14-linux64/bin/pypy -mpip install -r requirements.txt
rm pypy3.10-v7.3.14-linux64.tar.bz2
zip -r ./get_schedule.zip . -x ".env" "deploy.dev.sh" "requirements.txt" "deploy.prod.sh"
aws s3 cp ./get_schedule.zip s3://lambda.illiniclassscheduler.com
aws lambda update-function-code --function-name get_schedule --s3-bucket lambda.illiniclassscheduler.com --s3-key get_schedule.zip
rm ./get_schedule.zip
