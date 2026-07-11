import pyautogui
import keyboard
import time
import random
import re

print("running")

def main():

    def interval(char):
        if char.isalpha():
            return random.gauss(0.09, 0.02)
        elif char.isdigit():
            return random.gauss(0.10, 0.02)
        elif char == ' ':
            return random.gauss(0.13, 0.03)
        else:
            return random.gauss(0.11, 0.02)

    def clamp(val, lo, hi):
        return max(lo, min(hi, val))

    def punctuation_pause():
        time.sleep(random.uniform(0.4, 1.2))

    def typo():
        count = random.randint(1, 3)
        for _ in range(count):
            ch = random.choice('abcdefghijklmnopqrstuvwxyz')
            pyautogui.typewrite(ch)
            time.sleep(clamp(interval(ch), 0.03, 0.12))
        time.sleep(random.uniform(0.1, 0.4))
        for _ in range(count):
            pyautogui.press('backspace')
            time.sleep(random.uniform(0.04, 0.09))

    def human_typewrite(char):
        if char.isupper():
            time.sleep(random.uniform(0.01, 0.04))
        if random.random() < 0.02:
            typo()
        pyautogui.typewrite(char.lower() if char.isalpha() else char, interval=0)
        if char.isupper():
            time.sleep(random.uniform(0.01, 0.03))

    def type_code(code):
        try:
            lines = code.split('\n')
            for line in lines:
                for i, char in enumerate(line):
                    if char == ' ':
                        pyautogui.press('space')
                        if random.random() < 0.005:
                            time.sleep(random.uniform(0.05, 0.1))
                            pyautogui.press('space')
                            time.sleep(random.uniform(0.1, 0.3))
                            pyautogui.press('backspace')
                    else:
                        human_typewrite(char)

                    word_pos = i / max(len(line), 1)
                    speed_factor = 1.0 - 0.3 * (1 - abs(word_pos - 0.5) * 2)
                    delay = clamp(interval(char) * speed_factor, 0.06, 0.28)

                    if random.random() < 0.08:
                        delay *= random.uniform(0.6, 0.9)

                    time.sleep(delay)

                    if random.random() < 0.003:
                        time.sleep(random.uniform(0.5, 2.0))

                if line.rstrip().endswith(('.', ',', ':', ';', '?', '!')):
                    punctuation_pause()

                pyautogui.press('enter')
                time.sleep(clamp(random.gauss(0.12, 0.05), 0.05, 0.4))

            print("Successfully Power Pasted")
        except pyautogui.FailSafeException as e:
            print("Stopped Power Pasting |", e)

    file_path = 'code.txt'
    with open(file_path, 'r') as file:
        content = file.read()

    code_snippets = content.split('END\n')

    typed_buffer = []
    is_typing = False

    trigger_re = re.compile(r"(///\d{3})$")

    def on_key_press(e):
        nonlocal typed_buffer, is_typing
        if is_typing:
            return

        name = e.name if hasattr(e, 'name') else str(e)

        if name == 'space':
            ch = ' '
        elif name == 'enter':
            ch = '\n'
        elif name == 'backspace':
            if typed_buffer:
                typed_buffer.pop()
            return
        elif len(name) == 1:
            ch = name
        else:
            return

        typed_buffer.append(ch)
        if len(typed_buffer) > 20:
            typed_buffer = typed_buffer[-20:]

        buf = ''.join(typed_buffer)
        m = trigger_re.search(buf)
        if m:
            digits = m.group(1).lstrip('/')
            try:
                idx = int(digits) - 1
            except ValueError:
                return
            if 0 <= idx < len(code_snippets):
                is_typing = True
                time.sleep(0.25)
                type_code(code_snippets[idx].rstrip('\n'))
                is_typing = False
                typed_buffer = []

    keyboard.on_press(on_key_press)
    keyboard.wait('esc')

main()
