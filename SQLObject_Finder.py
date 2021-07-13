from strHelper import *
import sys, os


def process(filename):
	table_list = []
	sp_list = []
	pick_next = False 
	line_num = 0
	words_to_search = {'table':['from','join','into','table'], 'storeproc': ['exec', 'execute']}

	if(os.path.isfile(filename)):
		with open(filename,'r') as f:
			for line in f:
				#remove 
				line = fine_str(line).lower()
				
				line_num +=1
				if(line.startswith("--") or line.startswith("#")):
					continue
					
				if(pick_next):
					table_list.append(get_word(line,0))
					pick_next = False 
				if(line.endswith('from')):
					pick_next = True 
					continue 
					
				for key in words_to_search:
					for obj in words_to_search.get(key):
						if (obj + ' ') in line:
							try:
								if key=='table':
									tblname = next_word(line,obj)
									if '(' in tblname: 
										tblname = cutoff(tblname,'(',True)
									table_list.append(tblname)
								elif key=='storeproc':
									sp_list.append(next_word(line,obj))
								else:
									other_list.append(next_word(line,obj))
							except:
									print ("error for ", obj , "at line#", line_num, " ", line)
			# convert to Set so that unique object can stored
	return set(table_list), set(sp_list) 
	
def valid_file(filename,allowedExt=['.sql','.pl']):
    if os.path.isfile(filename):
        name,exe = os.path.splitext(filename)
        if exe.lower() in allowedExt:
            return True
        else:
            return False
    else:
        return False
    
        
# test 
'''
my_text = "select * from a_emboss ae (Nolock) inner join dbo.g_account_client gac(Nolock) on ae.pan"
print(next_word(my_text,'from'))
print(next_word(my_text,'join'))
'''
#print(cutoff('a_emboss(nolock)','('))

#filename = sys.argv[1]
filename = r'D:\FinancialReports_PerlSource\DSSReports\Daily\Standard\StdFileFeed\Monetary\StandardFileFeed_MON_Stmt.pl'
if filename.endswith('\\'):
	filename = filename[0:-1]
	print(filename)
	
if os.path.isfile(filename):
	table,sp = process(filename)
	tblcount = len(table)
	spcount = len(sp)
	print("info in ", filename)
	
	if tblcount > 0:
		print("# of Tables : ", tblcount)
		for t in table:
			print(t)
	else:
		print("No table found")
	if spcount > 0:
		print("# of Storeproc(s): ", spcount)
		for s in sp:
			print(s)
elif os.path.isdir(filename):
	for root, dir, file in os.walk(filename):
		if(file):
			for f in file:
				pfile = os.path.join(root,f)
				if valid_file(pfile,['.pl']):
					table, sp = process(pfile)
					print("Info in file", os.path.basename(pfile))
					print('-' * 20)
					for t in table:
						print(t)
					for s in sp:
						print(s)
				#else:
				#	print(pfile, "is not valid to search")
else:
 	print(filname, " is not valid file or folder ")

