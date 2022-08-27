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
