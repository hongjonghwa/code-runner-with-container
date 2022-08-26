x=`aws sts get-caller-identity | python3 -c "import sys, json; print(json.load(sys.stdin)['Account'])"`
echo $x
