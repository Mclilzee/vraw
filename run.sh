#!/usr/bin/zsh

clang++ main.cpp -o main -lraylib -I./raylib/include -L./raylib/lib && ./main
