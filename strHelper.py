'''
	Commom functions for string handling/ parsing
	
'''

'''
Covert into pure string and remove single, double quotes.
'''
def fine_str(text):
	return str(text).replace('"','').replace("'",'').strip()

def list_to_str(lst,sep=' '):
	return sep.join(str(i) for i in lst)

# cut rest of the string from char position
'''
	Cut rest of the string from char position
	ex: cutoff('two white puppiles','white')
	    returns 
'''
def cutoff(word,char,right=True):
	ret = word 
	if char in word :
		if right == True:
			ret = word[:word.find(char)]
		elif right == False:
			ret = word[word.find(char):] 
	return ret

def next_word(text,search_word,case_sensitive=False):
	ret_text = ''
	if(not case_sensitive):
		text = text.lower().strip()
		search_word = search_word.lower()
	if (not text.endswith(search_word)):
		ret_text = text.split()[text.split().index(search_word)+1]
	return ret_text


def get_word(text,pos):
	return  text.split()[pos] 


def get_remaining_text(text,pos):
	word =  get_word(text,pos)
	remaing_text =  text[text.index(word) + len(word):]
	return remaing_text
	