# Pulling
docker pull ubuntu:22.04

# Run - Ubuntu
docker run -it --rm ubuntu:22.04 /bin/bash
  
# Run - Base (admin)
docker run -it --rm base:0.1 /bin/bash


# Run - Base (user)
docker run -it --rm \
  --network none \
  --cpus 0.125 \
  -m 125m \
  -u user \
  -w /CODE \
  base:0.1 /bin/bash
  
apt install -y python3 python-is-python3 python3-pip
  


docker run -it --name db001 -h db001 -p 3306:3306 \
--net mybridge --net-alias=db001 \
-v /db/db001/data:/var/lib/mysql \
-v /db/db001/log:/var/log/mysql \
-v /db/db001/conf:/etc/percona-server.conf.d \
-e MYSQL_ROOT_PASSWORD="root" -d percona:5.7.30



sudo useradd -m -g $grp -s /bin/bash -p "${ENC_PW}" $account  

