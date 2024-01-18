from selectors import EVENT_READ, DefaultSelector, EVENT_WRITE
import socket as socket

selector = DefaultSelector()

stopped = False

urls_todo = set(['/'])
seen_urls = set(['/'])

class Fetcher:
    def __init__(self, url):
        self.response = b''
        self.url = url
        self.sock = None
    
    def fetch(self):
        self.sock = socket.socket()
        self.sock.setblocking(False)
        try:
            self.sock.connect(('xkcd.com', 80))
        except BlockingIOError:
            pass

        selector.register(self.sock.fileno(),
                          EVENT_WRITE,
                          self.connected)

    def connected(self, key, mask):
        print('connected!')
        selector.unregister(key.fd)
        request = 'GET {} HTTP/1.0\r\nHost: xkcd.com\r\n\r\n'.format(self.url)
        self.sock.send(request.encode('ascii'))

        selector.register(key.fd,
                          EVENT_READ,
                          self.read_response)

    def read_response(self, key, mask):
        global stopped

        chunk = self.sock.recv(4096)
        if chunk:
            self.response += chunk
        else:
            selector.unregister(key.fd)
            links = self.parse_links()

        for link in links.difference(seen_urls):
            urls_todo.add(link)
            Fetcher(link).fetch()

        seen_urls.update(links)
        urls_todo.remove(self.url)
        if not urls_todo:
            stopped = True

fetcher = Fetcher('/353/')
fetcher.fetch()

while True:
    events = selector.select()
    for event_key, event_mask in events:
        callback = event_key.data
        callback(event_key, event_mask)
