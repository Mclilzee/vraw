#include <iostream>
#include <raylib.h>
#include <vector>

static const int SCREEN_WIDTH = 800;
static const int SCREEN_HEIGHT = 800;
static const int CX = SCREEN_WIDTH / 2;
static const int CY = SCREEN_HEIGHT / 2;
static const int WIDTH = 600;
static const int HEIGHT = 600;
static const int NUMBERS_LEFT_BAR_PADDING = 30;
static const int BAR_HEIGHT = 15;
static const int CURSOR_POSITION_RIGHT_PADDING = 15;
static const int TEXT_PADDING = 3;
static const int VERTICAL_TEXT_PADDING = 5;
static const int NUMBERS_BOTTOM_BAR_PADDING = 25;
static const int CANVAS_WIDTH = WIDTH + NUMBERS_LEFT_BAR_PADDING * 2;
static const int CANVAS_HEIGHT = HEIGHT + NUMBERS_LEFT_BAR_PADDING + BAR_HEIGHT;
static const int STATUS_INFO_WIDTH = CANVAS_WIDTH;
static const int STATUS_INFO_HEIGHT = NUMBERS_BOTTOM_BAR_PADDING;
static const Vector2 BOARD_START{CX - WIDTH / 2,
                                 CY - HEIGHT / 2 - NUMBERS_BOTTOM_BAR_PADDING};
static const Vector2 BOARD_END{CX + WIDTH / 2,
                               CY + HEIGHT / 2 - NUMBERS_BOTTOM_BAR_PADDING};

class Cursor {
  public:
    int x = 0;
    int y = 0;
    Color color = Color{0, 0, 0, 150};
};

class Board {
  public:
    int rows;
    int columns;
    std::vector<Color> cells;
    std::vector<Color> visual_mask;
    Cursor cursor;

    Board(int rows, int columns) {
        this->rows = rows;
        this->columns = columns;

        std::vector<Color> cells = std::vector<Color>(rows * columns);
        std::vector<Color> visual_mask = std::vector<Color>(rows * columns);
        for (int i = 0; i < columns * rows; i++) {
            cells.at(i) = RAYWHITE;
            visual_mask.at(i) = Color{};
        }

        this->cells = cells;
        this->visual_mask = visual_mask;
    }
};

void render_board(Board *board) {
    ClearBackground(DARKGRAY);
    int width = WIDTH / board->columns;
    int height = HEIGHT / board->rows;
    for (int i = 0; i < board->rows; i++) {
        for (int j = 0; j < board->rows; j++) {
            int x = BOARD_START.x + j * width;
            int y = BOARD_START.y + i * height;
            DrawRectangle(x, y, width, height,
                          board->cells.at(board->rows * i + j));
            DrawRectangle(x, y, width, height,
                          board->visual_mask.at(board->rows * i + j));
        }
    }

    int x = board->cursor.x * width + BOARD_START.x;
    int y = board->cursor.y * height + BOARD_START.y;
    DrawRectangle(x, y, width, height, board->cursor.color);

    // Include one more for bottom line drawing
    for (int i = 0; i <= board->rows; i++) {
        int y = BOARD_START.y + i * height;
        DrawLine(BOARD_START.x, y, BOARD_END.x, y, BLACK);
        int x = BOARD_START.x + i * width;
        DrawLine(x, BOARD_START.y, x, BOARD_END.y, BLACK);
    }

    // renderBoardNumbers(board);
    // renderBoardStatusBar(board.cursor.x + 1, board.cursor.y + 1);
}

int main() {
    InitWindow(SCREEN_WIDTH, SCREEN_HEIGHT, "V-Draw");
    Board board{10, 10};
    while (!WindowShouldClose()) {
        BeginDrawing();
        render_board(&board);
        EndDrawing();
    }

    CloseWindow();
    return 0;
}
