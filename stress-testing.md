---
layout: page
title: "Stress testing"
permalink: /stress-testing/
---

Otus-course ["Stress testing"](https://otus.ru/lessons/loadqa/)

##  Check procedure
- <ins>Simple</ins> check
    - You should add **load** on site (use 'Instruments')
    - then **check** dashboard
- <ins>Advance</ins> check (for stress-testers)
    - You should see **user-scenarios** on site-pages
    - then add load on site
    - then check dashboard
    - then create **report**
    - then set up an **automatic** stress-testing  **pipeline**
    
##  Instruments

1. [Yandex-tank](https://github.com/p-12s/docker-yandex-tank) - load-generator tool.   
For heavy load add 'pandora' into yandex-tank.  
 Docker-command:
 ```
docker run \
    -v $(pwd):/var/loadtest \
    -v $SSH_AUTH_SOCK:/ssh-agent -e SSH_AUTH_SOCK=/ssh-agent \
    --net host \
    -it direvius/yandex-tank
```
2. [Jmeter](https://github.com/p-12s/docker-jmeter) - load-generator tool.  
Change file test.sh:  
 ```
export TARGET_HOST="www.map5.nl"
export TARGET_PORT="80"
export TARGET_PATH="/kaarten.html"
export TARGET_KEYWORD="Kaartdiensten"
```
and run:
```
./test.sh
```
3. [GoAccess](https://hub.docker.com/r/allinurl/goaccess) - log-reading tool.  
   Docker-command:
 ```
cat access.log | docker run --rm -i -e \ 
    LANG=$LANG allinurl/goaccess -a -o html \ 
    --log-format COMBINED - > report.html
```
