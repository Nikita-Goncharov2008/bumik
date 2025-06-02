import json
import os
from django.conf import settings
from django.utils.safestring import mark_safe

class WebpackLoader:
    def __init__(self):
        self.manifest_path = os.path.join(
            settings.BASE_DIR, 'static/dist/manifest.json'
        )
    
    def get_manifest(self):
        try:
            with open(self.manifest_path, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {}
    
    def get_files(self, bundle_name):
        manifest = self.get_manifest()
        return manifest.get(bundle_name, {})

# Функция для использования в шаблонах
def webpack_static(bundle_name):
    loader = WebpackLoader()
    files = loader.get_files(bundle_name)
    return files

