import os

def find(lst, file):
	lst = [ x.lower() for x in lst ]
	found = False
	if os.path.isfile(file):
		print('it is a file')
		with open(file,'r') as fh:
			for line in fh:
				line = line.lower()
				found_text = [ x for x in lst if x in line ]
				if len(found_text) > 0:
					print('found..')
					found = True
					
	return found 
	

file_list = [r"D:\MyTasks\2020\SQL tuning\Registry_files\Registry_files\LRK1WGRPERPSQ01_ODBC.reg" \
			 ]
words = ['database','LRK1WGRPERPSQ01','Windows']		
for file in file_list:
	r = find(words,file)
	print(f'{file} ==> {r}')
	