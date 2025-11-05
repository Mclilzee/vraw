#include <cmath>
#include <iostream>
#include <raylib.h>
#include <string>
#include <vector>

static const int SCREEN_WIDTH = 1000;
static const int SCREEN_HEIGHT = 1000;
static const int WIDTH = 800;
static const int HEIGHT = 800;
static const int CX = SCREEN_WIDTH / 2;
static const int CY = SCREEN_HEIGHT / 2;
static const int NUMBERS_LEFT_BAR_PADDING = 20;
static const int BAR_HEIGHT = 15;
static const int CURSOR_POSITION_RIGHT_PADDING = 15;
static const int TEXT_PADDING = 3;
static const int VERTICAL_TEXT_PADDING = 5;
static const int NUMBERS_BOTTOM_BAR_PADDING = 10;
static const Vector2 BOARD_START{CX - WIDTH / 2,
                                 CY - HEIGHT / 2 - NUMBERS_BOTTOM_BAR_PADDING};
static const Vector2 BOARD_END{CX + WIDTH / 2,
                               CY + HEIGHT / 2 - NUMBERS_BOTTOM_BAR_PADDING};

class Cursor {
  public:
    int x = 0;
    int y = 0;
    Color color = GetColor(0x0000008A);
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

std::vector<int> get_numbers(int anchor, int size) {
    std::vector<int> array;
    for (int i = anchor; i > anchor - size; i--) {
        array.push_back(std::abs(i));
    }

    return array;
}

void render_board_number(Board board) {
    std::vector<int> vertical_numbers = get_numbers(board.cursor.x, board.rows);
    int height = HEIGHT / board.rows;
    int width = WIDTH / board.columns;
    int font_size = height / 2;
    int font_padding = font_size / 2;

    for (int i = 0; i < vertical_numbers.size(); i++) {
        int y = BOARD_START.y + i * height + font_padding;
        int number = vertical_numbers.at(i);

        if (number == 0) {
            DrawText(std::to_string(number).c_str(),
                     BOARD_START.x - NUMBERS_LEFT_BAR_PADDING, y, font_size,
                     RED);
        } else {
            DrawText(std::to_string(number).c_str(),
                     BOARD_START.x - NUMBERS_LEFT_BAR_PADDING, y, font_size,
                     WHITE);
        }

        std::vector<int> horizontal_numbers =
            get_numbers(board.cursor.y, board.columns);
        int x = BOARD_START.x + i * width + font_padding;
        number = horizontal_numbers.at(i);
        if (number == 0) {
            DrawText(std::to_string(number).c_str(), x,
                     BOARD_END.y + NUMBERS_BOTTOM_BAR_PADDING, font_size, RED);
        } else {
            DrawText(std::to_string(number).c_str(), x,
                     BOARD_END.y + NUMBERS_BOTTOM_BAR_PADDING, font_size,
                     WHITE);
        }
    }
}

void render_board_status_bar(Cursor cursour) {
    int y = BOARD_END.y + NUMBERS_BOTTOM_BAR_PADDING + BAR_HEIGHT;
    int x = BOARD_START.x - NUMBERS_LEFT_BAR_PADDING;
    int font_size = BAR_HEIGHT - TEXT_PADDING;
    DrawRectangle(x, y, WIDTH + NUMBERS_LEFT_BAR_PADDING * 2, BAR_HEIGHT, GRAY);

    std::string text = "vim/drawing.cpp";
    DrawText(text.c_str(), x + TEXT_PADDING, y + BAR_HEIGHT / 2 - font_size / 2, font_size,
             WHITE);
    // boardCtx.fillText("vim/drawing.ts", TEXT_PADDING,
    //                   y + BAR_HEIGHT / 2 + TEXT_PADDING);
    //
    // boardCtx.fillText(`${cursorRow}, $ { cursorColumn }`,
    //                   BOARD_WIDTH - CURSOR_POSITION_RIGHT_PADDING,
    //                   y + BAR_HEIGHT / 2 + TEXT_PADDING);
}

void render_board(Board board) {
    ClearBackground(DARKGRAY);
    int width = WIDTH / board.columns;
    int height = HEIGHT / board.rows;
    for (int i = 0; i < board.rows; i++) {
        for (int j = 0; j < board.rows; j++) {
            int x = BOARD_START.x + j * width;
            int y = BOARD_START.y + i * height;
            DrawRectangle(x, y, width, height,
                          board.cells.at(board.rows * i + j));
            DrawRectangle(x, y, width, height,
                          board.visual_mask.at(board.rows * i + j));
        }
    }

    int x = board.cursor.x * width + BOARD_START.x;
    int y = board.cursor.y * height + BOARD_START.y;
    DrawRectangle(x, y, width, height, board.cursor.color);

    // Include one more for bottom line drawing
    for (int i = 0; i <= board.rows; i++) {
        int y = BOARD_START.y + i * height;
        DrawLine(BOARD_START.x, y, BOARD_END.x, y, BLACK);
        int x = BOARD_START.x + i * width;
        DrawLine(x, BOARD_START.y, x, BOARD_END.y, BLACK);
    }

    render_board_number(board);
    render_board_status_bar(board.cursor);
}

int main() {
    InitWindow(SCREEN_WIDTH, SCREEN_HEIGHT, "V-Draw");
    Board board{40, 40};
    while (!WindowShouldClose()) {
        BeginDrawing();
        render_board(board);
        EndDrawing();
    }

    CloseWindow();
    return 0;
}
