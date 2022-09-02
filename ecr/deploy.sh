# 레포 생성
# aws ecr create-repository --repository-name code-runner-python
# 이미지 업로드
source ./ecr-uploader.sh code-runner-python:3.10-pandas
