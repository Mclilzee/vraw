#include <raylib.h>

static const int SCREEN_WIDTH = 1200;
static const int SCREEN_HEIGHT = 1200;
static const int COLUMNS = 40;
static const int ROWS = 40;
static const int BOARD_WIDTH = 600;
static const int BOARD_HEIGHT = 600;
static const int RIGHT_TEXT_PADDING = 30;
static const int BAR_HEIGHT = 15;
static const int CURSOR_POSITION_RIGHT_PADDING = 15;
static const int TEXT_PADDING = 3;
static const int VERTICAL_TEXT_PADDING = 5;
static const int STATUS_BAR_INFO_HEIGHT = 25;
static const int CANVAS_WIDTH = BOARD_WIDTH + RIGHT_TEXT_PADDING * 2;
static const int CANVAS_HEIGHT = BOARD_HEIGHT + RIGHT_TEXT_PADDING + BAR_HEIGHT;
static const int STATUS_INFO_WIDTH = CANVAS_WIDTH;
static const int STATUS_INFO_HEIGHT = STATUS_BAR_INFO_HEIGHT;

class Cursor {
  public:
    int x = 0;
    int y = 0;
    Color color = RED;
};

class Board {
  public:
    Color cells[COLUMNS * ROWS];
    Color visual_mask[COLUMNS * ROWS] = {0};
    Cursor cursor;

    Board() {
        for (int i = 0; i < COLUMNS * ROWS; i++) {
            this->cells[i] = RAYWHITE;
        }
    }
};

void render_board(Board *board) {
    ClearBackground(DARKGRAY);
    int width = BOARD_WIDTH / COLUMNS;
    int height = BOARD_HEIGHT / ROWS;
    for (int i = 0; i < ROWS; i++) {
        for (int j = 0; j < COLUMNS; j++) {
            int x = j * width + RIGHT_TEXT_PADDING;
            DrawRectangle(x, i * height, width, height,
                          board->cells[ROWS * i + j]);
            DrawRectangle(x, i * height, width, height,
                          board->visual_mask[i * j]);
        }
    }

    for (int i = 0; i < ROWS; i++) {
        DrawLine(RIGHT_TEXT_PADDING, i * height,
                 BOARD_WIDTH + RIGHT_TEXT_PADDING, i * height, BLACK);
        DrawLine(i * width + RIGHT_TEXT_PADDING, 0,
                 i * width + RIGHT_TEXT_PADDING, BOARD_HEIGHT, BLACK);
    }

    DrawRectangle(board->cursor.y * width + RIGHT_TEXT_PADDING,
                  board->cursor.x * height, width, height, board->cursor.color);
    // renderBoardNumbers(board);
    // renderBoardStatusBar(board.cursor.x + 1, board.cursor.y + 1);
}

int main() {
    InitWindow(BOARD_WIDTH * 2, BOARD_HEIGHT * 2, "V-Draw");
    Board board{};
    while (!WindowShouldClose()) {
        BeginDrawing();
        render_board(&board);
        EndDrawing();
    }

    CloseWindow();
    return 0;
}
