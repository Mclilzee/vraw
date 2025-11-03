#include <iostream>
#include <raylib.h>

using namespace std;

int main() {
    InitWindow(800, 800, "Hello world");

    while(!WindowShouldClose()) {
        BeginDrawing();
        EndDrawing();
    }

    return 0;
}
