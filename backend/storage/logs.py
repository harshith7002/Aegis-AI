LOGS = []

def add_log(item: dict):
    LOGS.insert(0, item)
    if len(LOGS) > 100:
        LOGS.pop()

def get_logs():
    return LOGS
