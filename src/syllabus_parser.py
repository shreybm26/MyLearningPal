import spacy

nlp = spacy.load("en_core_web_sm")

def syllabus_parser(syllabus):
    doc = nlp(syllabus)
    topics = []
    current_topic = ""
    for sent in doc.sents:
        if any([token.pos_ == "NOUN" or token.pos_=="PROPN" for token in sent]):
            current_topic = sent.text.strip()
        topics.append(current_topic)

    return list(set(topics))
