# -*- coding: utf-8 -*-
"""
Created on Sat May  8 11:00:03 2021

@author: e1011127
"""
import datetime 
def authendicator(num_length):
    '''
    Parameters
    ----------
    num_length : postisive number
        DESCRIPTION. number of digit

    Returns
    -------
    positive number

    '''
    # algorithm   Xn = (a * Xn-1 + b) % m.
    # m > 0 (the modulus is positive),
    # 0 < a < m (the multiplier is positive but less than the modulus),
    # 0 ≤ b < m (the increment is non negative but less than the modulus), and
    # 0 ≤ X0 < m (the seed is non negative but less than the modulus).
    y = datetime.datetime.utcnow().year
    m = datetime.datetime.utcnow().month
    d = datetime.datetime.utcnow().day
    h = datetime.datetime.utcnow().hour
    mi = datetime.datetime.utcnow().minute
    s = datetime.datetime.utcnow().second
    ms = round(datetime.datetime.utcnow().microsecond % 10000,0)
    
    seed = ((y*m*d)% m) + (ms % s)
    print(seed) 
    
    a    = (d * m) % 300
    b    = h % 12
    # m <= 60
    m    = abs(ms - (mi * s))
    if m > 10000:
        m = m - 10000 
    
    print(seed,a,b,m)
    output = ""
    for i  in range(num_length):
        seed = allgorithm(seed, a,b,m) % 100
        print(seed)

def allgorithm(seed, a,b,m):
    return (a * seed + b) % m


authendicator(1)



