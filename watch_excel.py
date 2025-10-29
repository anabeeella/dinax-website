#!/usr/bin/env python3
"""
Script to watch products-list.xlsx and automatically convert to products.json when changed
Install required package: pip install watchdog openpyxl
Run: python3 watch_excel.py
"""

import time
import sys
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import subprocess
import os

class ExcelChangeHandler(FileSystemEventHandler):
    """Handler for Excel file changes"""
    
    def __init__(self, excel_path, converter_script):
        self.excel_path = excel_path
        self.converter_script = converter_script
        self.last_modified = 0
        self.debounce_time = 2  # Wait 2 seconds after last change before converting
        
    def on_modified(self, event):
        """Called when a file is modified"""
        if event.src_path.endswith(self.excel_path.split('/')[-1]):
            # Debounce: only convert if enough time has passed since last modification
            current_time = time.time()
            if current_time - self.last_modified > self.debounce_time:
                self.last_modified = current_time
                print(f"\n📝 Detected change in {self.excel_path}")
                print("🔄 Converting to products.json...")
                self.convert_excel_to_json()
    
    def convert_excel_to_json(self):
        """Run the conversion script"""
        try:
            result = subprocess.run(
                [sys.executable, self.converter_script],
                capture_output=True,
                text=True,
                timeout=30
            )
            if result.returncode == 0:
                print("✅ Conversion completed successfully!\n")
            else:
                print(f"❌ Error during conversion:\n{result.stderr}\n")
        except Exception as e:
            print(f"❌ Error running conversion: {e}\n")

def watch_excel_file():
    """Start watching the Excel file for changes"""
    excel_path = "assets/images/products/products-list.xlsx"
    converter_script = "convert_xlsx_to_json.py"
    
    # Check if Excel file exists
    if not os.path.exists(excel_path):
        print(f"❌ Error: {excel_path} not found!")
        return
    
    # Check if converter script exists
    if not os.path.exists(converter_script):
        print(f"❌ Error: {converter_script} not found!")
        return
    
    # Create event handler
    event_handler = ExcelChangeHandler(excel_path, converter_script)
    
    # Create observer
    observer = Observer()
    
    # Get directory to watch
    watch_directory = os.path.dirname(excel_path) or '.'
    
    # Schedule watching
    observer.schedule(event_handler, watch_directory, recursive=False)
    
    # Start observer
    observer.start()
    
    print(f"👀 Watching {excel_path} for changes...")
    print("📝 Any modifications will automatically convert to products.json")
    print("⏹️  Press Ctrl+C to stop\n")
    
    # Initial conversion
    print("🔄 Running initial conversion...")
    event_handler.convert_excel_to_json()
    
    try:
        # Keep running
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n\n⏹️  Stopping file watcher...")
        observer.stop()
    
    observer.join()
    print("✅ File watcher stopped")

if __name__ == "__main__":
    try:
        watch_excel_file()
    except ImportError:
        print("❌ Error: watchdog not installed")
        print("Install it with: pip install watchdog")
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

