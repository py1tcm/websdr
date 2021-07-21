#!/bin/bash

## Script para executar o websdr64 com os library na pasta dist11
## Necessario para contornar o problema do libcripto e libpgn obsoletos
## Cleber Couto PY1TCM - 29/04/2021

LD_LIBRARY_PATH=. ./websdr64

exit
