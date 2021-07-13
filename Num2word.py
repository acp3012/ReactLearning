'''
	Converts number to number name
	
'''
__author__ = "Palpantian"
def num2word(num):
	'''
		This funcntion Converts number to number name and retuns
	
	'''
	belowTwenty = ["zero","one ","two ","three ","four ","five ","six ","seven ","eight ","nine ","ten " \
				   ,"eleven ","twele ","thirteen ","fourteen ", "fifteen ","sixteen ","seventeen ","eighteen ","nineteen "]
	
	tens = ["","","twenty","thirty","fourty","fifty","sixty","seventy","eighty","ninty"]
	result = "" ; 
	
	if(num <= 19):
		result = belowTwenty[num]
	elif(num >=20 and num < 100):
		q = num // 10 
		r = num % 10
		if r > 0 :
			result = tens[q] + ' ' + belowTwenty[r]
		else:
			result = tens[q] 
	else:
		# pos-> 0123456789     
		# num = 1234567890
		# len = 10 
		strnum = str(num)
		l = len(strnum)
		ten = strnum[-2:] # last 2 digit
		hund = strnum[-3]  # 3rd from last 
		thou = strnum[-5:-3]
		lakh = strnum[-7:-5]
		cror = strnum[:-7]
		if cror.isnumeric() and int(cror) >0:
			result = num2word(int(cror)) + 'crore '
		if lakh.isnumeric() and int(lakh) >0:
			result = result + ' ' +num2word(int(lakh)) + 'lakh '
		if thou.isnumeric() and int(thou) >0 :
			result = result + num2word(int(thou)) + 'thousand '	
		if hund.isnumeric() and int(hund) >0:
			result = result + num2word(int(hund)) + 'hundred '	
		if ten.isnumeric():
			result = result + num2word(int(ten))
	return result	

# test the function 

#num = 2323
num = int(input("enter a number :"))

str = num2word(num)
print("number = {0}. Number name - {1}".format(num,str)) 		
		

