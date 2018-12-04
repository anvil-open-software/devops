import requests
import random
import boto3
#randomly generate words from a public dictionary and pushes it in batches to kinesis

region = 'us-east-1'
kinesisStreamName = 'wc_20'
kinesis = boto3.client('kinesis',region_name=region)

batch_size=499

word_site = "http://svnweb.freebsd.org/csrg/share/dict/words?view=co&content-type=text/plain"
response = requests.get(word_site)
WORDS = response.content.splitlines()

count=0
while True:
    word = random.choice(WORDS)

    patitionKey = "shard" + str(random.randint(0,20))
    print (patitionKey + ": " + word)
    if count == 0:
            putRecordsList = [{'Data': word, 'PartitionKey': patitionKey }]
    else:
            putRecordsList.append({'Data': word, 'PartitionKey': patitionKey })

    if count == batch_size:
            result = kinesis.put_records(Records=putRecordsList,StreamName=kinesisStreamName)
          #  print result
            count=0
    else:
            count += 1
