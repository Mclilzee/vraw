#include <cmath>
#include <iostream>
#include <raylib.h>
#include <string>
#include <vector>

static const int SCREEN_WIDTH = 1000;
static const int SCREEN_HEIGHT = 1000;
static const int ROWS = 40;
static const int COLUMNS = 40;
static const int WIDTH = 800;
static const int HEIGHT = 800;
static const int NUMBERS_LEFT_BAR_PADDING = 20;
static const int TEXT_X_PADDING = 10;
static const int TEXT_Y_PADDING = 5;
static const int INFO_BAR_HEIGHT = 18;
static const int STATUS_BAR_HEIGHT = 25;
static const int NUMBERS_BOTTOM_BAR_PADDING = 10;
static const int BOARD_TOP_PADDING = 40;
static const Vector2 BOARD_START{SCREEN_WIDTH / 2 - WIDTH / 2,
                                 BOARD_TOP_PADDING};
static const Vector2 BOARD_END{SCREEN_WIDTH / 2 + WIDTH / 2,
                               HEIGHT + BOARD_TOP_PADDING};
static const std::string HEX_MAP[] = {"0", "1", "2", "3", "4", "5", "6", "7",
                                      "8", "9", "A", "B", "C", "D", "E", "F"};

static const std::string MODE_TEXT[] = {":",
                                        "-- VISUAL --",
                                        "-- VISUAL LINE --",
                                        "-- VISUAL BLOCK --",
                                        "-- NORMAL --",
                                        "-- INSERT --",
                                        "-- DELETE --"};

// STATE
enum EditorMode {
    COMMAND,
    VISUAL,
    VISUAL_LINE,
    VISUAL_BLOCK,
    NORMAL,
    INSERT,
    DELETE
};

std::string command_text = "";
EditorMode current_mode = NORMAL;
int visual_start_index = 0;

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

std::string color_to_hex(Color color) {
    return "#" + HEX_MAP[color.r / 16] + HEX_MAP[color.r % 16] +
           HEX_MAP[color.g / 16] + HEX_MAP[color.g % 16] +
           HEX_MAP[color.b / 16] + HEX_MAP[color.b % 16];
}

std::vector<int> get_numbers(int anchor, int size) {
    std::vector<int> array;
    for (int i = anchor; i > anchor - size; i--) {
        array.push_back(std::abs(i));
    }

    return array;
}

void render_board_number(Board *board) {
    int height = HEIGHT / board->rows;
    int width = WIDTH / board->columns;
    int font_size = height / 2;
    int font_padding = font_size / 2;

    std::vector<int> v_numbers = get_numbers(board->cursor.y, board->columns);
    std::vector<int> h_numbers = get_numbers(board->cursor.x, board->rows);
    for (size_t i = 0; i < v_numbers.size(); i++) {
        int y = BOARD_START.y + i * height + font_padding;

        int number = v_numbers.at(i);
        if (number == 0) {
            DrawText(std::to_string(number).c_str(),
                     BOARD_START.x - NUMBERS_LEFT_BAR_PADDING, y, font_size,
                     RED);
        } else {
            DrawText(std::to_string(number).c_str(),
                     BOARD_START.x - NUMBERS_LEFT_BAR_PADDING, y, font_size,
                     WHITE);
        }

        int x = BOARD_START.x + i * width + font_padding;
        number = h_numbers.at(i);
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

void render_board_info_bar() {
    int y = BOARD_END.y + NUMBERS_BOTTOM_BAR_PADDING + INFO_BAR_HEIGHT +
            STATUS_BAR_HEIGHT;

    int font_size = STATUS_BAR_HEIGHT - TEXT_Y_PADDING;
    std::string text = MODE_TEXT[current_mode];
    if (current_mode == COMMAND) {
        text += command_text;
    }
    DrawText(text.c_str(), BOARD_START.x - TEXT_X_PADDING,
             y + INFO_BAR_HEIGHT / 2 - font_size / 2, font_size, ORANGE);
}

void render_board_status_bar(Board *board) {
    int y = BOARD_END.y + NUMBERS_BOTTOM_BAR_PADDING + INFO_BAR_HEIGHT;
    int x = BOARD_START.x - NUMBERS_LEFT_BAR_PADDING;
    int font_size = INFO_BAR_HEIGHT - TEXT_Y_PADDING;
    DrawRectangle(x, y, WIDTH + NUMBERS_LEFT_BAR_PADDING * 2, INFO_BAR_HEIGHT,
                  GRAY);

    std::string color =
        color_to_hex(board->cells.at(board->cursor.x * board->cursor.y));
    DrawText(color.c_str(), x + TEXT_X_PADDING,
             y + INFO_BAR_HEIGHT / 2 - font_size / 2, font_size, WHITE);

    std::string position = std::to_string(board->cursor.x + 1) + "," +
                           std::to_string(board->cursor.y + 1);
    x = BOARD_END.x - font_size * position.size();
    DrawText(position.c_str(), x - TEXT_X_PADDING,
             y + INFO_BAR_HEIGHT / 2 - font_size / 2, font_size, WHITE);
}

static void render_board(Board *board) {
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

    render_board_number(board);
    render_board_status_bar(board);
    render_board_info_bar();
}

int main() {
    InitWindow(SCREEN_WIDTH, SCREEN_HEIGHT, "V-Draw");
    EnableEventWaiting();
    // TODO: Uncomment after finishing for mode switching
    // SetExitKey(KEY_NULL);
    Board board{ROWS, COLUMNS};
    int board_cell_width = WIDTH / ROWS;
    int board_cell_height = HEIGHT / COLUMNS;
    while (!WindowShouldClose()) {
        if (current_mode != COMMAND) {
            command_text = "";
        }

        switch (current_mode) {
        case COMMAND: {
            int key_pressed = GetKeyPressed();
            if (key_pressed >= KEY_COMMA && key_pressed <= KEY_GRAVE) {
                command_text += GetKeyName(key_pressed);
            } else if (IsKeyPressed(KEY_SPACE)) {
                command_text += " ";
            } else if (IsKeyDown(KEY_BACKSPACE)) {
                command_text = command_text.substr(0, command_text.size() - 1);
            }
        } break;
        }

        if (IsMouseButtonDown(MOUSE_BUTTON_LEFT)) {
            current_mode = NORMAL;
            Vector2 position = GetMousePosition();
            int x = (position.x - BOARD_START.x) / board_cell_width;
            int y = (position.y - BOARD_START.y) / board_cell_height;
            if (x >= 0 && x < ROWS && y >= 0 && y < COLUMNS) {
                board.cursor.x = x;
                board.cursor.y = y;
            }
        }

        if (current_mode != COMMAND && IsKeyPressed(KEY_SEMICOLON) &&
            (IsKeyDown(KEY_LEFT_SHIFT) || IsKeyDown(KEY_RIGHT_SHIFT))) {
            current_mode = COMMAND;
        }

        BeginDrawing();
        render_board(&board);
        EndDrawing();
    }

    CloseWindow();
    return 0;
}
