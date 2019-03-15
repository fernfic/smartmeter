#!/usr/bin/env python
# -*- coding: utf-8 -*- 

from django.shortcuts import render, redirect
from django.core.mail import send_mail
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from ..models import Meter
from ..post_data import parse_keys
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import json
from datetime import datetime, timedelta
import requests
import pytz

import numpy as np
import base64, zlib, time
import threading
from jsonmerge import Merger
import os, glob
import urllib3
from collections import defaultdict, deque
# from collections import deque
from statistics import mean 
import pandas as pd
import platform

urllib3.disable_warnings()

time_data, p1, p2, p3, p4, q1, q2, q3, q4, s1, s2, s3, s4, i1, i2, i3, i4, pf1 = ([] for i in range(18))
p1_wh, p2_wh, p3_wh, p4_wh = ({'day':{},'month':{}, 'year':{}} for i in range(4))
cur_d1m, cur_d1hr, cur_d30m = (pd.DataFrame() for i in range(3))
cur_wh = [0, 0, 0, 0]
bill_cost = defaultdict(list)
bill, unit = 0, 0
watt_data = deque([])

key = {
    "type": "service_account",
    "project_id": "data-log-fb39d",
    "private_key_id": "80fcc158210ed58b29588b3a67d52c170c60d0d4",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDnosoCGh4cByPb\nmXVsjoBR+jOhgh58Z8qrU6Z33MhIQ045fHsscz1ncI7HsgNC5jQ7dQ6ZY0IB9sMq\n0Z3JUo3KMS9lpsd/MAs8oq+zmU39QsGTm+Ha7kiTQuI4PjkOfUB9oyVcdyP6TXUk\nrAzrIAwJfnar5NKmFcpK6EsNzsumx2QVQaC/zK8VAQou8KBmEDc6VsHhUWFh6j9p\nSN0iCw8hWXjVRI/r1ReUs9kR+30QDSXnNIO77a8XFmZyC2maEnqPY6vSeRP1cTWa\nHHackO8TxnhR4siLwZ7o4LVe25ocLIbzC6PnzCDXgG7Vk/Yc2UsGdogcjgbGvjP9\n6yq5iWEvAgMBAAECggEARLStdIgorCmWAjn3cXanKymqjNpajo3+uGi8dMshAQYt\nurFom5um9/qT7zmm6/36OjSTWv3tA0YdR6MbSS7abcG/DEi23cvzWU3sDbqIPnnB\njzXqfRS2pC9viD00kU6nhVyR5WZVXpYBDBqYTlmYGGzRaFUcAjVuZl+We4b+Mv5b\nA/eWRx9AoJEy0Vr4HexEeJI+mJCOag+Ab1Kk4YkOpTLgDhnHHLfzn5n+H4Da8VaS\n5//4uFCDF5TIwHz4L3qZCWudDlVq6UF4390IpQTMMdyDgQJfeiesvQdcPKzae9EV\nYBo/QftB/kbZ66RukVAgIVEOf3vJtZplcfm+8MJokQKBgQD08/cnT2pze5hk7NnL\n09aSTYs/v7YKTQVgy5dCmQ5s/9KtS0KNnH2wbM/gIvmDSdsSoLVsSylybgShxF/f\n8yqprmtdPxw8jIkHUnyZIKBQAKYTXTfZF5QUgJ3E8qGxJ3xBUWGr4ZvdiXkDW4B4\n9O1VGhBMvy9DIN9GliF8yilnqQKBgQDyFRMvnXtgYj6T0IhAj8wEVuQy4V1MpLEb\neV8bmyX03vYm9h4fdd/OntrSwx1IfDP+q76SX4L2y6dlBoO3vS2HJ/9EbDeK35/C\nscwiToaoVljVZwGOqjkeMr1fH9DvQVBX8pupgVQtG3lERzl0GUgJBsMUID9JbkSp\nDSPq0t8pFwKBgGTJ9YoxPSXjVyM/6aXatlFgoslKQsceRfY8DzMR80OaR7+SVgIa\nwATV4PriqTQCMagKhFvY2WcCKdm+CY0GaymCYR7vFtk7Ii7nG+mN6SjB+5PAKXik\nIQQGn+QnyawxCQl/SOcGX7HaHPbqsYQTk4wOu2I40GOYpQZQQ9sq+7pxAoGBAIWk\nhNcAhaAMHKfVs6KQv/yVS52bNLqfIPcd5heDa0zn2dRggvizRj73C67W8E+X4cxy\nW97Kw64jd+IZ2pWQ5pV6yz2m0HLmSXheV2eJGmXMZXZKS13LM4UsVccx9VJgKE6l\nLLJDJ4lPZX8AIwOpAU+aYA+4TbfoHBeHnZCBoZk5AoGBANjr5irUefz0Q9N1qUWi\nfX9phEKXRxPt9RQlx3TQuUh64kfoaIOlOZrT70GlFjPwgi2OSDzY7LFsSw1YNU3E\n++GeVXcxcjEAAUrxbfBS89sN8Qv3GSe/Kl3TH9MJ0cEfmbmH/UOw9ktqpPDJBHBF\n8PGSHAkwT18oMazDVlTJqlNc\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-qthge@data-log-fb39d.iam.gserviceaccount.com",
    "client_id": "111119234437985151574",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-qthge%40data-log-fb39d.iam.gserviceaccount.com"
}

cred = credentials.Certificate(key)
firebase_admin.initialize_app(cred, {
    'databaseURL' : 'https://data-log-fb39d.firebaseio.com/'
})

    
def index(request):
    global p1_wh, p2_wh, p3_wh, p4_wh, cur_wh, bill_cost, bill, watt_data
    # ref = db.reference('energy')
    # start = datetime.now()
    # result = ref.order_by_child('time').limit_to_last(300).get() # 30 mins
    # end = datetime.now()
    # print(end - start)
    _m = Meter.objects.all()
    module_dir = os.path.dirname(__file__)
    bill_path = os.path.join(module_dir, '../../static/json/setting.json')
    data_bill = open(bill_path , 'r')  
    data = json.load(data_bill)
    dbill = data["bill-cycle"]
    dunit = data["unit"]
    today = unixtime_to_readable(time.time())
    month = today[0]+"-"+today[1].zfill(2)
    day = today[0]+"-"+today[1].zfill(2)+"-"+today[2].zfill(2)
    daily_p = [cur_wh[0]/1000,cur_wh[1]/1000,cur_wh[2]/1000,cur_wh[3]/1000]
    now_p1 = watt_data[-1]["P1"]
    now_p2 = watt_data[-1]["P2"]
    now_p3 = watt_data[-1]["P3"]
    now_p4 = watt_data[-1]["P4"]
    now_p = [now_p1, now_p2, now_p3, now_p4]
    # monthly_p1 = (p1_wh['month'][month] + cur_wh[0])/1000
    # monthly_p2 = (p2_wh['month'][month] + cur_wh[1])/1000
    # monthly_p3 = (p3_wh['month'][month] + cur_wh[2])/1000
    # monthly_p4 = (p4_wh['month'][month] + cur_wh[3])/1000
    # monthly_p = [monthly_p1, monthly_p2, monthly_p3, monthly_p4]
    bill_report = bill + cur_wh[0]/1000
    cost = bill_report*float(dunit)
    return render(request, "index.html", {"energy": json.dumps(list(watt_data)), 
                                          "daily_p": json.dumps(daily_p),
                                          "now_p": json.dumps(now_p),
                                          "meter": _m, "dbill": dbill, "unit":dunit,
                                          'bill_cost': cost, 'bill_cost_date':[min(bill_cost['date']), max(bill_cost['date'])]
                                        })

def setting(request):
    module_dir = os.path.dirname(__file__)  
    ip_path = os.path.join(module_dir, '../../static/json/ip.txt')
    bill_path = os.path.join(module_dir, '../../static/json/setting.json')
    data_ip = open(ip_path , 'r')   
    data_bill = open(bill_path , 'r')  
    data = json.load(data_bill)
    dbill = data["bill-cycle"]
    dunit = data["unit"]
    ip = data_ip.read()
    _m = Meter.objects.all()
    _range = range(1,32)
    return render(request, "setting.html",{"meter": _m, "ip_now" : ip, 
                                           "range": _range, "dbill":dbill, "unit": dunit})

def history(request):
    global p1_wh, p2_wh, p3_wh, p4_wh, cur_wh
    column = []
    _m = Meter.objects.all()
    p1_val, p2_val, p3_val, p4_val = [[] for i in range(4)]
    for k in p1_wh['day']:
        column.append(k)
    column = sorted(column)[-6:]
    for c in column:
        p1_val.append(p1_wh['day'][c]/1000)
        p2_val.append(p2_wh['day'][c]/1000)
        p3_val.append(p3_wh['day'][c]/1000)
        p4_val.append(p4_wh['day'][c]/1000)
    # print(column)
    today = unixtime_to_readable(time.time())
    today_s = today[0]+'-'+today[1].zfill(2)+'-'+today[2].zfill(2)
    if today_s not in column :
        column.append(today_s)
        p1_val.append(cur_wh[0]/1000)
        p2_val.append(cur_wh[1]/1000)
        p3_val.append(cur_wh[2]/1000)
        p4_val.append(cur_wh[3]/1000)
    return render(request,"history.html",{"d_col": json.dumps(column),"meter": _m,
                                          "p1_val": json.dumps(p1_val),
                                          "p2_val": json.dumps(p2_val),
                                          "p3_val": json.dumps(p3_val),
                                          "p4_val": json.dumps(p4_val)})
    
def del_history(request):
    return redirect("/history/")
    
def graph(request):
    return render(request, "graph.html")

def unixtime_to_readable(unixtime):
    tz = pytz.timezone('Asia/Bangkok')
    now = datetime.fromtimestamp(unixtime, tz)
    month = now.month
    year = now.year
    day = now.day
    hour = now.strftime('%H')
    minute = now.strftime('%M')
    second = now.strftime('%S')
    return (str(year), str(month), str(day), hour, minute, second)

def get_current_energy(request):
    global cur_wh, p1_wh, p2_wh, p3_wh, p4_wh, bill_cost, bill, unit, watt_data
    # print("cur"+str(cur_wh[0]))
    bill_date, unit = get_data_setting()
    today = unixtime_to_readable(time.time())
    month = today[0]+"-"+today[1].zfill(2)
    day = today[0]+"-"+today[1].zfill(2)+'-'+today[2].zfill(2)
    # monthly_p1 = (p1_wh['month'][month] + cur_wh[0])/1000
    # monthly_p2 = (p2_wh['month'][month] + cur_wh[1])/1000
    # monthly_p3 = (p3_wh['month'][month] + cur_wh[2])/1000
    # monthly_p4 = (p4_wh['month'][month] + cur_wh[3])/1000
    now_p1 = watt_data[-1]["P1"]
    now_p2 = watt_data[-1]["P2"]
    now_p3 = watt_data[-1]["P3"]
    now_p4 = watt_data[-1]["P4"]
    now_p = [now_p1, now_p2, now_p3, now_p4]
    bill_report = bill+cur_wh[0]/1000
    cost = bill_report*unit
    data = {
        'daily_cur': [cur_wh[0]/1000, cur_wh[1]/1000, cur_wh[2]/1000, cur_wh[3]/1000],
        # 'monthly_cur': [monthly_p1, monthly_p2, monthly_p3, monthly_p4],
        'now_p' : now_p,
        'bill_cost': cost, 'bill_cost_date':[min(bill_cost['date']), max(bill_cost['date'])]
    }
    return JsonResponse(data)

def save_json(keep_day, d_1m, d_30m, d_1hr, p1_wh_val, p2_wh_val, p3_wh_val, p4_wh_val, list_column):
    global p1_wh, p2_wh, p3_wh, p4_wh 
    print("open save json")
    module_dir = os.path.dirname(__file__)  
    file_path = os.path.join(module_dir, '../../static/json/data_energy/')
    time_data = unixtime_to_readable(keep_day[0])
    year = time_data[0]
    month = time_data[1]
    day = time_data[2]
    dic_data = {}
    time = ["1m", "30m", "1hr"]
    keep_json = {"sum_p1" : round(p1_wh_val,2), "sum_p2" : round(p2_wh_val,2), "sum_p3" : round(p3_wh_val,2), "sum_p4" : round(p4_wh_val,2)}
    for t in time:
        dic_data = {}
        data = {}
        for n in list_column:
            data[n] = list(eval("d_{}[n]".format(t)))
        dic_data[t] = data
        keep_json.update(dic_data)         
    file_name = year+"-"+month.zfill(2)+"-"+day.zfill(2)
    with open(file_path+file_name+".json", 'w+') as f:
        json.dump(keep_json, f, ensure_ascii=False)
    print("upload json "+file_name)
    d = year+"-"+month.zfill(2)+"-"+day.zfill(2)
    m = year+"-"+month.zfill(2)
    set_data_realtime(d, m, year, [keep_json['sum_p1'],keep_json['sum_p2'],keep_json['sum_p3'],keep_json['sum_p4']])

def keep_data_realtime(d, wh, time_data, keep_day, keep_hour, keep_minute, check30):
    global cur_d1m, cur_d1hr, cur_d30m, cur_wh, bill, bill_cost, watt_data
    ref = db.reference('energy')
    print("get old value prepare at "+str(int(time.time())))
    if(len(time_data)>0):
        get_start = time_data[len(time_data)-1]
    else:
        keep_date = unixtime_to_readable(time.time())
        new_date = keep_date[2]+'-'+keep_date[1]+'-'+keep_date[0]
        if(platform.system() == "Windows"):
            get_start = int(time.mktime(datetime.strptime(new_date, "%d-%m-%Y").timetuple()))
        else:
            get_start = int(time.mktime(datetime.strptime(new_date, "%d-%m-%Y").timetuple())) - 25200
    result = ref.order_by_child('time').start_at(int(get_start)).end_at(int(time.time())).get()
    for val in result.values():
        time_value = val["time"]
        keep_day, keep_hour, keep_minute, check30, d, wh, time_data = check_condition(val, time_value,keep_day, keep_hour, keep_minute, check30, d, wh, time_data)

    print("real time start at "+str(int(time.time())))
    time_before = 0
    print(len(time_data))
    day_before = ''
    while(True):
        result = ref.order_by_child('time').limit_to_last(1).get()
        
        for val in result.values():
            time_value = val["time"]
            if(time_before != time_value):
                watt_data.popleft()
                watt_data.append(list(result.values())[0])
                today = unixtime_to_readable(time_value)
                print(today)
                
                time_before = time_value
                keep_day, keep_hour, keep_minute, check30, d, wh, time_data = check_condition(val, time_value,keep_day, keep_hour, keep_minute, check30, d, wh, time_data)
                cur_d1m = d[0]
                cur_d30m = d[1]
                cur_d1hr = d[2]
                cur_wh = wh
                bill_date, unit = get_data_setting()
                day_now = today[0]+"-"+today[1].zfill(2)+'-'+today[2].zfill(2)
                if bill_date == today[2]:
                    save_bill_cost(cost, bill_cost)
                if day_before != day_now:
                    bill_cost['date'].append(day_now)
                    day_before = day_now
                bill_report = bill + cur_wh[0]/1000
                cost = bill_report*unit
                # print("kwh_month", bill_report)
                # print("cost", bill_report*unit)
                # print(bill_cost['date'])
                time.sleep(1)

def get_data_setting():
    module_dir = os.path.dirname(__file__)  
    setting_json_path = os.path.join(module_dir, '../../static/json/setting.json')
    json_setting_data = open(setting_json_path , 'r')  
    data_json = json.load(json_setting_data)
    bill_date = data_json['bill-cycle']
    unit = float(data_json['unit'])
    return bill_date, unit

def backup_from_firebase():
    print("Start Backup")
    t_start = datetime.now()
    d_1m, d_30m, d_1hr, d_1m_cur, d_30m_cur, d_1hr_cur = (pd.DataFrame() for i in range(6))
    p1_wh_value, p2_wh_value, p3_wh_value, p4_wh_value = (0 for i in range(4))
    d = [d_1m, d_30m, d_1hr, d_1m_cur, d_30m_cur, d_1hr_cur]
    wh = [p1_wh_value, p2_wh_value, p3_wh_value, p4_wh_value]
    time_data = []

    ref = db.reference('energy')
    module_dir = os.path.dirname(__file__)  
    file_path = os.path.join(module_dir, '../../static/json/data_energy')
    list_of_files = glob.glob(file_path+'/*') # * means all if need specific format then *.csv
    # print(list_of_files)
    if(len(list_of_files) > 0):
        all_file = []
        for f in list_of_files:
            _, s = os.path.split(f)
            _d = int(os.path.splitext(s)[0].split('-')[2])
            _m = os.path.splitext(s)[0].split('-')[1]
            _y = os.path.splitext(s)[0].split('-')[0]
            new_date = str(_d).zfill(2)+'-'+_m.zfill(2)+'-'+_y
            print(new_date)
            if(platform.system() == "Windows"):
                all_file.append(int(time.mktime(datetime.strptime(new_date, "%d-%m-%Y").timetuple()))+86400)
            else:
                all_file.append(int(time.mktime(datetime.strptime(new_date, "%d-%m-%Y").timetuple()))-25200+86400)
        latest_file = max(all_file)
        print("last file="+str(unixtime_to_readable(latest_file)))
        start = latest_file
    else:
        start = 1549386000 # started at 06-02-2019

    endt = int(time.time())
    print("end", unixtime_to_readable(endt))
    print("start", unixtime_to_readable(start))
    result = ref.order_by_child('time').start_at(int(start)).end_at(int(endt)).get()  
    print("get firebase complete")
    check30 = True	
    for val in result.values():
        time_value = val["time"]
        keep_date = unixtime_to_readable(time_value) 
        keep_day = keep_date[2]
        keep_hour = keep_date[3]
        keep_minute = keep_date[4]  
        break
    for val in result.values():
        time_value = val["time"]
        keep_day, keep_hour, keep_minute, check30, d, wh, time_data = check_condition(val, time_value,keep_day, keep_hour, keep_minute, check30, d, wh, time_data)

    print("-----------------------------Complete--------------------------------------")
    print(datetime.now()-t_start)
    print(time_data)
    print(len(time_data))
    keep_data_realtime(d, wh, time_data, keep_day, keep_hour, keep_minute, check30)

def check_condition(val, time_value, keep_day, keep_hour, keep_minute, check30, d, wh, time_data):
    d_1m, d_30m, d_1hr, d_1m_cur, d_30m_cur, d_1hr_cur = d
    p1_wh_value, p2_wh_value, p3_wh_value, p4_wh_value = wh
    list_column = ["p1", "p2", "p3", "p4", "s1", "s2", "s3", "s4", "q1", "q2", "q3", "q4", "i1", "i2", "i3", "i4", "pf1", "time"]
    p1_value = val["P1"]
    p2_value = val["P2"]
    p3_value = val["P3"]
    p4_value = val["P4"]
    q1_value = val["Q1"]
    q2_value = val["Q2"]
    try:
        q3_value = val["Q3"]
    except:
        q3_value = 0
    q4_value = val["Q4"]
    i1_value = val["I1"]
    i2_value = val["I2"]
    i3_value = val["I3"]
    i4_value = val["I4"]
    s1_value = val["S1"]
    s2_value = val["S2"]
    s3_value = val["S3"]
    s4_value = val["S4"]
    pf1_value = val["PF1"]
    p1_wh_value += val["P1_wh"]*3
    p2_wh_value += val["P2_wh"]*3
    p3_wh_value += val["P3_wh"]*3
    p4_wh_value += val["P4_wh"]*3
    if(keep_minute != unixtime_to_readable(time_value)[4]):
        list_val = []
        for col in d_1m_cur:
            if(col != "time"):          		
                list_val.append(round(mean(d_1m_cur[col]),2))
        # new > add append time_value
        list_val.append(time_value)
        d_1m = d_1m.append(pd.DataFrame([list_val], columns=list_column), ignore_index=True)
        d_1m_cur = pd.DataFrame()
        keep_minute = unixtime_to_readable(time_value)[4]

    if(unixtime_to_readable(time_value)[4] == "30" and check30 == True):
        print("30minutes")
        list_val = []
        for col in d_30m_cur:
            if(col != "time"):  
                list_val.append(round(mean(d_30m_cur[col]),2))
        # new > add append time_value
        list_val.append(time_value)
        d_30m = d_30m.append(pd.DataFrame([list_val], columns=list_column), ignore_index=True)
        d_30m_cur = pd.DataFrame()
        check30 = False
    elif(unixtime_to_readable(time_value)[4] != "30" and check30 == False):
        print("re value")
        check30 = True

    if(keep_hour != unixtime_to_readable(time_value)[3]):
        list_val_1hr = []
        for col in d_1hr_cur:
            if(col != "time"):  
                list_val_1hr.append(round(mean(d_1hr_cur[col]),2))
        # new > add append time_value
        list_val_1hr.append(time_value)
        d_1hr = d_1hr.append(pd.DataFrame([list_val_1hr], columns=list_column), ignore_index=True)

        d_1hr_cur = pd.DataFrame()

        list_val_30m = []
        for col in d_30m_cur:
            if(col != "time"):  
                list_val_30m.append(round(mean(d_30m_cur[col]),2))
        # new > add append time_value
        list_val_30m.append(time_value)
        d_30m = d_30m.append(pd.DataFrame([list_val_30m], columns=list_column), ignore_index=True)
        d_30m_cur = pd.DataFrame()
        keep_hour = unixtime_to_readable(time_value)[3]

    if(keep_day != unixtime_to_readable(time_value)[2]):
        print("change day")
        save_json(time_data, d_1m, d_30m, d_1hr, p1_wh_value, p2_wh_value, p3_wh_value, p4_wh_value, list_column)
        time_data = []
        d_1m, d_30m, d_1hr, d_1m_cur, d_30m_cur, d_1hr_cur = (pd.DataFrame() for i in range(6))
        p1_wh_value, p2_wh_value, p3_wh_value, p4_wh_value = (0 for i in range(4))
        keep_day = unixtime_to_readable(time_value)[2]

    time_data.append(time_value)
    list_values = [p1_value, p2_value, p3_value, p4_value, s1_value, s2_value, s3_value, s4_value,\
                    q1_value, q2_value, q3_value, q4_value, i1_value, i2_value, i3_value, i4_value, pf1_value, time_value]
    d_1m_cur = d_1m_cur.append(pd.DataFrame([list_values], columns=list_column), ignore_index=True)
    d_30m_cur = d_30m_cur.append(pd.DataFrame([list_values], columns=list_column), ignore_index=True)
    d_1hr_cur = d_1hr_cur.append(pd.DataFrame([list_values], columns=list_column), ignore_index=True)
    d = [d_1m, d_30m, d_1hr, d_1m_cur, d_30m_cur, d_1hr_cur]
    wh = [p1_wh_value, p2_wh_value, p3_wh_value, p4_wh_value]
    # print(p1_wh_value)

    return(keep_day, keep_hour, keep_minute, check30, d, wh, time_data)

def set_data():
    global p1_wh, p2_wh, p3_wh, p4_wh, bill_cost, bill, unit, watt_data
    print("set_data")
    module_dir = os.path.dirname(__file__)  
    file_path = os.path.join(module_dir, '../../static/json/data_energy/')
    bill_cost_path = os.path.join(module_dir, '../../static/json/bill_cost/')
    if os.listdir(bill_cost_path):
        last_file = max(os.listdir(bill_cost_path)).split('.')[0]
    else:
        last_file = ''
    bill_date, unit = get_data_setting()
    list_of_files = glob.glob(file_path+'*')
    old_month = ''
    old_year = ''
    start = False
    
    if(len(list_of_files) > 0):
        for files in list_of_files:
            _, s = os.path.split(files)
            _d = os.path.splitext(s)[0].split('-')[2]
            _m = os.path.splitext(s)[0].split('-')[1]
            _y = os.path.splitext(s)[0].split('-')[0]
            new_day = _y+'-'+_m.zfill(2)+'-'+_d.zfill(2)
            new_month = _y+'-'+_m.zfill(2)
            new_year = _y
            if old_month != new_month:
                old_month = new_month
                p1_wh['month'][new_month], p2_wh['month'][new_month], p3_wh['month'][new_month], p4_wh['month'][new_month] = [0 for i in range(4)]
            if old_year != new_year:
                old_year = new_year
                p1_wh['year'][new_year], p2_wh['year'][new_year], p3_wh['year'][new_year], p4_wh['year'][new_year] = [0 for i in range(4)]
            if last_file == '':
                last_file = new_day
                start = True
            if bill_date.zfill(2) == _d.zfill(2) and start:
                if(bill_cost['date']):
                    cost = sum(bill_cost['bill'])*unit
                    save_bill_cost(cost, bill_cost['date'])
                
            with open(file_path+s) as f:
                data = json.load(f)
                p1_wh['day'][new_day] = data['sum_p1']
                p2_wh['day'][new_day] = data['sum_p2']
                p3_wh['day'][new_day] = data['sum_p3']
                p4_wh['day'][new_day] = data['sum_p4']

                p1_wh['month'][new_month] += data['sum_p1']
                p2_wh['month'][new_month] += data['sum_p2']
                p3_wh['month'][new_month] += data['sum_p3']
                p4_wh['month'][new_month] += data['sum_p4']

                if(start):
                    bill_cost['date'].append(new_day)
                    bill_cost['bill'].append(data['sum_p1']/1000)
                    bill = sum(bill_cost['bill'])

                p1_wh['year'][new_year] += data['sum_p1']
                p2_wh['year'][new_year] += data['sum_p2']
                p3_wh['year'][new_year] += data['sum_p3']
                p4_wh['year'][new_year] += data['sum_p4']

            if last_file == new_day:
                start = True

    ref = db.reference('energy')
    result = ref.order_by_child('time').limit_to_last(300).get() # 30 mins
    value_array = list(result.values())
    watt_data = deque(value_array)

def save_bill_cost(cost, date):
    global bill, bill_cost
    file_name = max(date)
    module_dir = os.path.dirname(__file__)  
    bill_cost_path = os.path.join(module_dir, '../../static/json/bill_cost/')
    keep_json = {"start":min(date), "end":max(date), "cost":cost}
    with open(bill_cost_path+file_name+".json", 'w+') as f:
        json.dump(keep_json, f, ensure_ascii=False)
    print("upload json "+file_name)
    bill_cost = defaultdict(list)
    bill = 0


def set_data_realtime(d, m, y, val):
    global p1_wh, p2_wh, p3_wh, p4_wh
    p1_wh['day'][d], p2_wh['day'][d], p3_wh['day'][d], p4_wh['day'][d] = val
    try:
        p1_wh['month'][m] += val[0]
        p2_wh['month'][m] += val[1]
        p3_wh['month'][m] += val[2]
        p4_wh['month'][m] += val[3]
    except:
        p1_wh['month'][m], p2_wh['month'][m], p3_wh['month'][m], p4_wh['month'][m] = val
    try:
        p1_wh['year'][y] += val[0]
        p2_wh['year'][y] += val[1]
        p3_wh['year'][y] += val[2]
        p4_wh['year'][y] += val[3]
    except:
        p1_wh['year'][y], p2_wh['year'][y], p3_wh['year'][y], p4_wh['year'][y] = val

def get_date_return_json(request):
    if request.method == "POST" and request.is_ajax():
        all_date = request.POST.get('all_date')
        date_list = json.loads(all_date)
        print(date_list)
        module_dir = os.path.dirname(__file__)  
        file_path = os.path.join(module_dir, '../../static/json/data_energy/')
        list_column = ["p1", "p2", "p3", "p4", "s1", "s2", "s3", "s4", "q1", "q2", "q3", "q4", "i1", "i2", "i3", "i4", "pf1", "time"]
        keep_data = pd.DataFrame()
        exist_file, list_val = [], []
        check_today = False
        query_time = ""
        today = unixtime_to_readable(time.time())
        today_s = today[0]+'-'+today[1].zfill(2)+'-'+today[2].zfill(2)
        for date in date_list:
            print(date)
            file_name = file_path+date+".json"
            if(os.path.isfile(file_name)):
                exist_file.append(file_name)
            elif(date == today_s):
                check_today = True
        if(1 <= len(exist_file) <= 7 or check_today):
            query_time = "1m"
        elif(len(exist_file) >= 8 and len(exist_file) <= 30):
            query_time = "30m"
        elif(len(exist_file) > 30):
            query_time = "1hr"
        else:
            error = "No Date in Database"
            data = {"error" : error}
            return JsonResponse(data)
        if(query_time):            
            keep_dict = defaultdict(list)
            for file_name in exist_file:
                data_file = open(file_name , 'r')       
                data = json.load(data_file)
                for column in list_column:
                    keep_dict[column] += data[query_time][column]
            if(check_today):
                for column in list_column:
                    keep_dict[column] += cur_d1m[column].values.tolist()
            for column in list_column:
                list_val.append(keep_dict[column])
            keep_data = keep_data.append(pd.DataFrame([list_val], columns=list_column), ignore_index=True)
        data = {}
        for column in list_column:
            data[column] = list(keep_data[column])  

        column = []
        _m = Meter.objects.all()
        p1_val, p2_val, p3_val, p4_val = [[] for i in range(4)]
        for k in date_list:
            if k in p1_wh['day']:
                column.append(k)
        column = sorted(column)
        for c in column:
            p1_val.append(p1_wh['day'][c]/1000)
            p2_val.append(p2_wh['day'][c]/1000)
            p3_val.append(p3_wh['day'][c]/1000)
            p4_val.append(p4_wh['day'][c]/1000)
        if check_today :
            column.append(today_s)
            p1_val.append(cur_wh[0]/1000)
            p2_val.append(cur_wh[1]/1000)
            p3_val.append(cur_wh[2]/1000)
            p4_val.append(cur_wh[3]/1000)
        keep_data2 = {'p1_val':p1_val, 'p2_val':p2_val, 'p3_val':p3_val, 'p4_val':p4_val, 'd_col':column}
        for k in keep_data2:
            data[k] = keep_data2[k]
    return JsonResponse(data)

th1 = threading.Thread(target = set_data).start()
th2 = threading.Thread(target = backup_from_firebase).start()
