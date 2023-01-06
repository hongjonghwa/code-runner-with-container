# one time run

docker run -it --rm \
 --name code-runner -h code-runner \
 --network none \
 --cpus 0.125 \
 -m 125m \
 -u user \
 -w /CODE \
 -v $(pwd)/code:/CODE \
 -p 80:8080 \
 code-runner-python:3.10-pandas python main.py

# multiple run

docker run -t --rm -d \
 --name code-runner -h code-runner \
 --network none \
 --cpus 0.125 \
 -m 125m \
 -u user \
 -w /CODE \
 -v $(pwd)/code:/CODE \
 -p 80:8080 \
 code-runner-python:3.10-pandas

docker exec -it code-runner bash
docker exec code-runner python main.py
docker exec code-runner python -c "print('hello world')"
docker exec code-runner sh -c "python main.py; python main.py; python main.py"
docker exec code-runner bash -c "time -p python main.py; time -p python main.py; time -p python main.py"
# 수행시간, 타임
docker exec code-runner /user/bin/time -f %e,%M python main.py
