#!/usr/bin/zsh

clang++ -Wextra -O3 main.cpp -o main -lraylib -I./raylib/include -L./raylib/lib && ./main
