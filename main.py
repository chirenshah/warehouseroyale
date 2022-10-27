import random
import itertools
from time import sleep

#set of three orders
# 1) find all the combinations for equal probabilty for every set
# 2) calculate quantity for every item in the combination
# 3) for points equal probability distribution is not desirable as we need points in a very narrow range and we also want it to dependent on quantity
# we could have another iteration where points is independent of quantity 
# 
# try different probability distributions.
# adaptive order generation is also possible, by using a varible to alter the probability distribution
# can run this before and and store the results or can run it every time an order is required  

#sku = stock keeping unit
# location in the warehouse are bins (A1,A2..)
# Every bin would have a maximum limit


def order_generator(selected,adaptive):
    order = {}
    points = 0
    quantity_range = [5,15]
    variance = 0.5
    normalize_factor = 1
    i = len(selected)
    for j in selected:
        quantity = random.randrange(quantity_range[0],quantity_range[1])//i #Number of pieces within a item
        rand = random.gauss(1+(i*normalize_factor*adaptive),variance) #gaussian distribution with mean 1 and variance increases with complex orders
        points += int(quantity*(rand))  #points being function of quantity
        order[j] = quantity
    order["points"] = points
    for x in order:
        print(str(x) + ": " + str(order[x]))
    return order
     

def init():
    sku = ['x','y','z']
    output = [1,1,1]
    order = [{} for x in range(3)]
    adaptive = 0.3
    similarity = 0.1
    comb = [[] for x in range(3)]
    print("Enter any digit more than 3 to quit")
    for i in range(3):
        comb[i] = list(itertools.combinations(sku,i+1))
    while(True):
        for i in range(3):
            weighted_select = random.choices(comb,weights=output)
            selected = random.choice(weighted_select[0])
            print(str(i+1) + ") -----------------------------")
            order[i] = order_generator(selected,0.1)
            print()
        res = input()
        if(not res.isdigit()):
            break
        else:
            res = int(res)
            if(res > 3):
                break
        adaptive = adaptive - (res-2)*0.05
        output[len(order[res-1])-2] += similarity
    print(output)
init()