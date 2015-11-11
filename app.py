import json

import pandas as pd

from flask import Flask
from flask import render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/polio_records')
def records_from_csv(csv_path='data/afpak_cases_with_genetics.csv'):
    df = pd.read_csv(csv_path,
                     index_col='epid',
                     usecols=['epid', 'age', 'sex', 'x', 'y',
                              'country', 'province', 'district',
                              'onset', 'doses.total', 'cluster']
                    )
    df.district = df.district.str.title()
    return df.to_json(orient='records', date_format='iso')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
