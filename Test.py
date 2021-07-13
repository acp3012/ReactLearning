from Num2word import num2word
import sys
def next_word(text,search_word,case_sensitive=False):
	ret_text = ''
	if(not case_sensitive):
		text = text.lower().strip()
		search_word = search_word.lower()
	if (not text.endswith(search_word)):
		ret_text = text.split()[text.split().index(search_word)+1]
	return ret_text
'''	
my_text = "$mysql = 'execute report_tables.dbo.prpt_popsuppnonmonetaryfeed ' . $$clientid .','.$startdate .','.$enddate.",'" .$optionalfields ."'";"
print(my_text)
print(type(my_text))
my_text = str(my_text).replace('"','').replace("'",'')
print(my_text)
print(type(my_text)) 
print(next_word(my_text,'execute'))
'''
if len(sys.argv) == 1:
	print("Converts given numeric value to word")
	print("usage : test.py <int value> ")
else:
	print(len(sys.argv))
	val = int(sys.argv[1])
	print(f'val = {num2word(val)}')
