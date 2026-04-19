#!/bin/bash

sed '/Pipeline successfully/q' <( docker logs gitlab-runner -f 2>&1)
          