import monodikit as m
import pandas as pd
corpus = m.Corpus("./data/*")
print(len(corpus.documents))

files = []
for d in corpus.documents:
    files.append({"textinitium": d.meta.initial_text, "uuid": d.meta.uuid, "volpiano": d.volpiano, "syllables": d.flat_text, "source": d.meta.source_id})

docs = pd.DataFrame(files)
docs.to_csv("dataset.csv")