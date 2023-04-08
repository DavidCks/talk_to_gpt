import os
import json

# List of strings to use for replacing "{$LOCALE}"
locale_strings = [
    'ar-SA',
    'bn-BD',
    'bn-IN',
    'cs-CZ',
    'da-DK',
    'de-AT',
    'de-CH',
    'de-DE',
    'el-GR',
    'en-AU',
    'en-CA',
    'en-GB',
    'en-IE',
    'en-IN',
    'en-NZ',
    'en-US',
    'en-ZA',
    'es-AR',
    'es-CL',
    'es-CO',
    'es-ES',
    'es-MX',
    'es-US',
    'fi-FI',
    'fr-BE',
    'fr-CA',
    'fr-CH',
    'fr-FR',
    'he-IL',
    'hi-IN',
    'hu-HU',
    'id-ID',
    'it-CH',
    'it-IT',
    'ja-JP',
    'ko-KR',
    'nl-BE',
    'nl-NL',
    'no-NO',
    'pl-PL',
    'pt-BR',
    'pt-PT',
    'ro-RO',
    'ru-RU',
    'sk-SK',
    'sv-SE',
    'ta-IN',
    'ta-LK',
    'th-TH',
    'tr-TR',
    'zh-CN',
    'zh-HK',
    'zh-TW'
]

# Read the contents of src/recognizers.js
with open('src/recognizers.js', 'r') as file:
    contents = file.read()

dir_path = "../../src/scripts/generated/recognizers/"
    # delete the directory if it already exists
if os.path.exists(dir_path) and os.path.isdir(dir_path):
    # delete directory and all its contents
    os.system('rm -rf {}'.format(dir_path))
    print('Directory deleted.')

# Replace "{$LOCALE}" with each string in locale_strings
for locale in locale_strings:
    new_contents = contents.replace("$LOCALE", locale)
    new_contents = new_contents.replace("$INDEX", locale.replace("-", "_"))

    # Create a new file with the name set to the string in locale_strings
    os.makedirs(dir_path, exist_ok=True)
    filename = f"{dir_path}{locale}.js"
    with open(filename, 'w') as file:
        file.write(new_contents)

    print(f"Created {filename}")

    # Update the "js" field of the "content_scripts" array in ../../manifest.json
    with open('../../manifest.json', 'r') as manifest_file:
        manifest = json.load(manifest_file)

    js_array = manifest['content_scripts'][0]['js']

    # Add the path to the generated file only if it's not already in the array
    if f"src/scripts/generated/recognizers/{locale}.js" not in js_array:
        js_array.append(f"src/scripts/generated/recognizers/{locale}.js")

        with open('../../manifest.json', 'w') as manifest_file:
            json.dump(manifest, manifest_file, indent=2)

        print(f"Added src/scripts/{locale}.js to manifest.json")

print("Done.")