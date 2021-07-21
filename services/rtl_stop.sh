#!/bin/bash

## Script para matar os servicos dos dongles rtl_tcp
## Necessario stop nos servicos por conta do bug do websdr no uso de upconverter
## Os servicos serao reiniciados automaticamente pelo systemd
## Cleber Couto PY1TCM - 29/04/2021

sleep 3
pkill -9 rtl_tcp
