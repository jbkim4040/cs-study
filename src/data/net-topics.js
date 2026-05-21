// CS Study — 컴퓨터 네트워크 주제 데이터
export const CATEGORIES = [
  { id: 'network',     label: '네트워크 계층', ids: ['icmp'] },
  { id: 'transport',   label: '전송 계층',     ids: ['transport', 'udp', 'tcp'] },
  { id: 'application', label: '응용 계층',     ids: ['application'] },
]

export const TOPICS = [
  // ── ICMP ──────────────────────────────────────────────────────
  {
    id: 'icmp', name: 'ICMP', subtitle: 'Internet Control Message Protocol',
    emoji: '📡', color: '#0ea5e9', category: 'network',
    tagline: 'IP의 빈틈을 메우는 오류 보고·진단 메신저',
    concept: [
      '**ICMP(Internet Control Message Protocol)**는 IP의 부족한 점을 보완하기 위해 설계된 네트워크 계층 프로토콜입니다. IP는 신뢰성이 없고 비연결형이라 오류를 보고하거나 호스트 상태를 질의하는 기능이 없습니다.',
      'ICMP 메시지는 독립적으로 전송되지 않고 **IP 데이터그램 안에 캡슐화**되어 전달됩니다. 즉 ICMP는 IP보다 상위 계층이 아니라 IP를 도와주는 동반자입니다.',
      'ICMP는 오류를 **보고**만 할 뿐 직접 고치지 않습니다. 오류 수정은 상위 계층(TCP 등)이나 응용 프로그램의 몫입니다.',
    ],
    keyPoints: [
      'IP의 한계(오류 보고·진단 기능 없음)를 보완',
      'IP 데이터그램에 캡슐화되어 전송',
      '메시지 = 오류 보고(error-reporting) + 질의(query)',
      '오류는 보고만, 수정은 상위 계층이 담당',
      'ping · traceroute의 동작 기반',
    ],
    terminology: [
      { term: 'ICMP', def: 'IP의 오류 보고·진단 기능을 보완하는 네트워크 계층 프로토콜' },
      { term: '오류 보고 메시지', def: '라우터·목적지 호스트가 IP 패킷 처리 중 발견한 문제를 발신지에 알리는 메시지' },
      { term: '질의 메시지', def: '호스트·관리자가 다른 호스트나 라우터의 상태 정보를 얻기 위해 보내는 메시지' },
      { term: '에코 요청과 응답', def: '타입 8과 0 — 두 호스트가 서로 통신 가능한지(도달성)를 확인하는 질의 메시지' },
      { term: 'TTL', def: 'Time To Live — 패킷이 거칠 수 있는 최대 홉 수. 0이 되면 폐기되고 시간 경과 메시지가 발생' },
      { term: 'ping', def: '에코 요청·응답으로 호스트 도달 여부와 왕복 시간(RTT)을 측정하는 도구' },
      { term: 'traceroute', def: 'TTL을 1씩 늘려가며 패킷이 거치는 경로(라우터)를 추적하는 도구' },
      { term: '검사합', def: 'Checksum — 헤더와 데이터 전체에 대해 계산하는 오류 검출 값' },
    ],
    classification: [
      { name: '목적지 도달 불가 (Type 3)', desc: '라우터가 라우팅할 수 없거나 호스트에 배달할 수 없을 때. 코드로 이유 표시(네트워크·호스트·프로토콜·포트 도달 불가 등)' },
      { name: '발신지 억제 (Type 4)', desc: '혼잡으로 데이터그램이 폐기됨을 알려, 발신지가 송신 속도를 늦추도록 요청' },
      { name: '시간 경과 (Type 11)', desc: 'TTL이 0이 되었거나, 단편이 제한 시간 내 모두 도착하지 않아 폐기' },
      { name: '매개변수 문제 (Type 12)', desc: '데이터그램 헤더 필드에서 불명확하거나 빠진 값을 발견했을 때' },
      { name: '재지정 (Type 5)', desc: '더 나은 라우터가 있을 때 호스트의 라우팅 테이블을 갱신하도록 안내' },
      { name: '에코 요청·응답 (Type 8/0)', desc: '[질의] 호스트 도달 가능성을 확인 — ping이 사용' },
      { name: '타임스탬프 요청·응답 (Type 13/14)', desc: '[질의] 두 시스템 간 왕복 시간 측정·시계 동기화' },
    ],
    mechanism: {
      description: '라우터나 목적지 호스트가 IP 패킷에서 문제를 발견하면, ICMP 메시지를 만들어 원래 발신지로 돌려보냅니다.',
      steps: [
        { title: '문제 발견', desc: '라우터·호스트가 IP 데이터그램을 처리하다 라우팅 불가·TTL 소진·헤더 오류 등을 발견' },
        { title: '데이터그램 폐기', desc: '문제가 있는 데이터그램은 폐기됨 — IP 자체는 이를 알릴 방법이 없음' },
        { title: 'ICMP 메시지 생성', desc: '원래 패킷의 IP 헤더 + 데이터 앞 8바이트를 담아 ICMP 오류 메시지를 작성(포트·순서번호 정보 포함)' },
        { title: '발신지로 전송', desc: '경로 정보는 발신지·목적지뿐이므로 오류 메시지는 항상 원래 발신지로 되돌아감' },
        { title: '상위 계층이 처리', desc: 'ICMP는 보고만 하고, 실제 대응(재전송·속도 조절 등)은 상위 계층이 결정' },
      ],
    },
    representation: [
      { title: 'Type (8비트)', desc: '메시지 유형 — 3=목적지 도달 불가, 8/0=에코, 11=시간 경과 등' },
      { title: 'Code (8비트)', desc: '같은 유형 안에서 구체적 이유 — 예: Type 3의 Code 3은 "포트 도달 불가"' },
      { title: 'Checksum (16비트)', desc: '헤더 + 데이터 전체에 대한 오류 검출 값' },
      { title: '헤더의 나머지 + 데이터', desc: '오류 메시지는 원래 IP 헤더와 데이터 앞 8바이트를, 질의 메시지는 식별자·순서번호를 담음 (총 헤더 8바이트)' },
    ],
    properties: [
      'ICMP 메시지 자체도 IP 데이터그램에 캡슐화되어 전달된다',
      'ICMP 오류 메시지를 운반하는 데이터그램에 대해서는 다시 ICMP 오류 메시지를 만들지 않는다 (무한 루프 방지)',
      '멀티캐스트 주소나 127.0.0.0·0.0.0.0 같은 특수 주소에는 오류 메시지를 생성하지 않는다',
      '단편화된 데이터그램은 첫 단편에 대해서만 오류 메시지를 만든다',
      '모든 오류 메시지는 원래 IP 헤더 + 데이터 앞 8바이트를 포함해, 발신지가 어떤 패킷이 문제인지 알 수 있다',
      '발신지 억제(Type 4)는 RFC 6633에서 폐기 권고되어 현대 네트워크에서는 거의 쓰이지 않지만, 개념 학습을 위해 함께 다룬다',
    ],
    code: {
      pseudo: `ICMP 오류 보고 흐름
  IF 라우터가 데이터그램을 라우팅할 수 없음:
      데이터그램 폐기
      ICMP_메시지 = 생성(Type=3, Code=원인)
      ICMP_메시지.data = 원본_IP헤더 + 원본_데이터[0:8]
      IP로 전송(목적지 = 원본.발신지주소)

ping 동작 (에코 요청 / 응답)
  REPEAT n번:
      t1 = 현재시각()
      에코요청 전송(Type=8, 목적지)
      에코응답 수신(Type=0)          # 못 받으면 timeout
      RTT = 현재시각() - t1
      출력("시간=" + RTT + "ms")`,
      c: `// 원시 소켓으로 ICMP 에코 요청 보내기 (요약)
#include <netinet/ip_icmp.h>

struct icmphdr icmp;
icmp.type = ICMP_ECHO;            // 8 = 에코 요청
icmp.code = 0;
icmp.un.echo.id = getpid();
icmp.un.echo.sequence = seq++;
icmp.checksum = 0;
icmp.checksum = checksum(&icmp, sizeof(icmp));

sendto(sock, &icmp, sizeof(icmp), 0,
       (struct sockaddr *)&dest, sizeof(dest));
// 응답(Type 0)을 recvfrom()으로 받아 RTT 계산`,
    },
    useCases: ['ping — 호스트 생존·도달성 확인', 'traceroute — 패킷 경로 추적', '네트워크 장애 진단', 'PMTU(경로 MTU) 탐색', '방화벽이 ICMP를 막으면 ping 실패'],
  },

  // ── 전송 계층 ─────────────────────────────────────────────────
  {
    id: 'transport', name: '전송 계층', subtitle: 'Transport Layer',
    emoji: '🚚', color: '#8b5cf6', category: 'transport',
    tagline: '호스트가 아니라 프로세스끼리 — 포트 번호의 세계',
    concept: [
      '**전송 계층(Transport Layer)**은 네트워크 계층과 응용 계층 사이에 위치하며, 네트워크 계층의 서비스를 받아 응용 계층에 제공합니다.',
      '네트워크 계층(IP)이 **호스트-대-호스트** 전달을 책임진다면, 전송 계층은 받은 메시지를 호스트 안의 **올바른 프로세스**에게 전달하는 **프로세스-대-프로세스** 통신을 책임집니다.',
      '어느 프로세스인지는 **포트 번호**로 구분합니다. IP 주소가 호스트를 고르고, 포트 번호가 그 호스트 안의 프로세스를 고릅니다.',
    ],
    keyPoints: [
      '프로세스-대-프로세스 통신을 담당',
      '포트 번호(0~65535)로 프로세스를 식별',
      '소켓 주소 = IP 주소 + 포트 번호',
      '다중화(보내기) · 역다중화(받기)',
      '흐름 제어 · 오류 제어로 신뢰성 보강',
    ],
    terminology: [
      { term: '프로세스-대-프로세스 통신', def: '호스트 안의 특정 프로세스끼리 메시지를 주고받는 것 — 전송 계층의 핵심 역할' },
      { term: '포트 번호', def: '한 호스트 안의 프로세스를 구분하는 16비트(0~65535) 식별자' },
      { term: '소켓 주소', def: 'IP 주소와 포트 번호의 조합 — 통신 종단점을 유일하게 지정' },
      { term: '잘 알려진 포트', def: 'well-known port — 0~1023, ICANN이 배정한 표준 서버 포트(HTTP 80, DNS 53 등)' },
      { term: '등록된 포트', def: 'registered port — 1024~49151, ICANN 배정은 아니나 중복을 피해 등록 가능' },
      { term: '동적 포트', def: 'dynamic port — 49152~65535, 클라이언트가 임시로 쓰는 포트' },
      { term: '다중화', def: 'Multiplexing — 여러 응용 프로세스의 데이터를 모아 하나의 전송 계층으로 내려보내는 것' },
      { term: '역다중화', def: 'Demultiplexing — 수신한 데이터를 포트 번호에 따라 올바른 프로세스로 나눠주는 것' },
    ],
    classification: [
      { name: '잘 알려진 포트 (0~1023)', desc: 'ICANN이 배정 — HTTP 80, HTTPS 443, DNS 53, SSH 22, SMTP 25 등 표준 서비스' },
      { name: '등록된 포트 (1024~49151)', desc: 'ICANN 배정은 아니나, 중복을 막기 위해 등록할 수 있는 포트' },
      { name: '동적·사설 포트 (49152~65535)', desc: '클라이언트 프로세스가 시작될 때 임시로 받는 포트' },
    ],
    mechanism: {
      description: '메시지가 송신 프로세스에서 수신 프로세스까지 가는 동안 전송 계층이 거치는 과정입니다.',
      steps: [
        { title: '캡슐화', desc: '송신 프로세스의 메시지에 포트 번호 등이 담긴 전송 계층 헤더를 붙여 패킷 생성' },
        { title: '다중화', desc: '여러 응용 프로세스가 동시에 네트워크를 쓸 수 있도록 데이터를 모아 IP로 내려보냄' },
        { title: '네트워크 전송', desc: 'IP가 호스트-대-호스트로 패킷을 목적지 호스트까지 운반' },
        { title: '역다중화', desc: '수신 측 전송 계층이 목적지 포트 번호를 보고 올바른 프로세스를 선택' },
        { title: '역캡슐화', desc: '헤더를 제거하고 메시지를 발신지 소켓 주소와 함께 응용 프로세스에 전달' },
      ],
    },
    comparison: {
      title: '잘 알려진 포트 번호',
      headers: ['포트', '프로토콜', '용도'],
      rows: [
        ['20 · 21', 'FTP', '파일 전송 (데이터 · 제어)'],
        ['22', 'SSH', '원격 접속 보안 프로토콜'],
        ['23', 'Telnet', '원격 호스트 접속'],
        ['25', 'SMTP', '이메일 송신'],
        ['53', 'DNS', '도메인 이름 ↔ IP 변환'],
        ['80', 'HTTP', '웹 페이지 전송'],
        ['110', 'POP3', '이메일 수신'],
        ['443', 'HTTPS', '암호화된 웹 전송'],
      ],
    },
    properties: [
      '네트워크 계층은 호스트까지만, 전송 계층은 그 안의 프로세스까지 데이터를 책임진다',
      '포트 번호는 16비트라서 0~65535 범위를 가진다',
      '서버는 잘 알려진 포트를, 클라이언트는 임시(동적) 포트를 사용하는 것이 일반적',
      '소켓 주소(IP+포트) 한 쌍이 통신 양 끝의 종단점을 유일하게 정의한다',
      '대표 전송 프로토콜은 UDP(비연결형)와 TCP(연결형)이며, SCTP도 있다',
    ],
    code: {
      pseudo: `전송 계층의 역다중화
  수신_패킷 도착
  목적지_포트 = 패킷.헤더.destination_port
  프로세스 = 포트테이블[목적지_포트]
  IF 프로세스 == 없음:
      ICMP "port unreachable" 전송
  ELSE:
      헤더 제거 후 프로세스에게 데이터 전달

소켓 주소
  소켓 = (IP 주소, 포트 번호)
  예) 서버      = (203.0.113.7, 80)
      클라이언트 = (198.51.100.2, 52000)`,
      python: `# 포트 번호로 프로세스를 지정하는 소켓 통신
import socket

# 서버: 잘 알려진 포트 80에 바인딩
srv = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
srv.bind(('0.0.0.0', 80))        # (IP, 포트) = 소켓 주소
srv.listen()

# 클라이언트: OS가 임시(동적) 포트를 자동 배정
cli = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
cli.connect(('203.0.113.7', 80))
print(cli.getsockname())         # ('198.51.100.2', 52000) 같은 동적 포트`,
    },
    useCases: ['웹 브라우저 ↔ 웹 서버(80/443)', '한 PC에서 여러 앱이 동시에 인터넷 사용', '서버가 포트별로 서비스 구분', 'NAT의 포트 주소 변환(PAT)'],
  },

  // ── UDP ───────────────────────────────────────────────────────
  {
    id: 'udp', name: 'UDP', subtitle: 'User Datagram Protocol',
    emoji: '⚡', color: '#f59e0b', category: 'transport',
    tagline: '빠르고 가볍게 — 신뢰성을 포기한 비연결형 전송',
    concept: [
      '**UDP(User Datagram Protocol)**는 최소한의 오버헤드만 사용하는 간단한 전송 계층 프로토콜입니다. 연결을 설정하지 않는 **비연결형**이며 **신뢰성을 보장하지 않습니다**.',
      'UDP가 하는 일은 포트 번호로 프로세스-대-프로세스 통신을 만들고, 검사합으로 오류를 탐지하는 것뿐입니다. 흐름 제어·혼잡 제어·재전송은 하지 않습니다.',
      '각 사용자 데이터그램은 서로 **독립적**이라 순서가 보장되지 않습니다. 대신 헤더가 8바이트로 작아 빠르고, 작은 메시지나 실시간 트래픽에 적합합니다.',
    ],
    keyPoints: [
      '비연결형 — 연결 설정/해제 과정 없음',
      '신뢰성 없음 — 재전송·순서 보장 안 함',
      '8바이트 고정 헤더 — 매우 가벼움',
      '검사합으로 오류 "탐지"만 (정정은 안 함)',
      'DNS · DHCP · 스트리밍 · 게임에 적합',
    ],
    terminology: [
      { term: 'UDP', def: '비연결형·비신뢰성 전송 계층 프로토콜 — 최소 오버헤드' },
      { term: '사용자 데이터그램', def: 'UDP가 다루는 패킷 — 8바이트 헤더 + 데이터' },
      { term: '비연결형', def: 'Connectionless — 연결 설정 없이 각 데이터그램을 독립적으로 전송' },
      { term: '검사합', def: 'Checksum — 오류 탐지용 값. UDP에서는 의사 헤더까지 포함해 계산' },
      { term: '의사 헤더', def: 'Pseudoheader — 검사합 계산에만 쓰이는 IP 헤더 일부. 패킷이 엉뚱한 호스트로 갔는지 확인' },
      { term: '큐잉', def: 'Queueing — 프로세스마다 포트 번호에 연결된 입력/출력 큐로 데이터그램을 주고받음' },
    ],
    representation: [
      { title: '발신지 포트 번호 (16비트)', desc: '데이터를 보낸 프로세스의 포트' },
      { title: '목적지 포트 번호 (16비트)', desc: '데이터를 받을 프로세스의 포트' },
      { title: '전체 길이 (16비트)', desc: '헤더 + 데이터 전체 길이 — 8~65535바이트' },
      { title: '검사합 (16비트)', desc: '오류 탐지값 — 선택 사항이며 안 쓰면 0으로 채움' },
    ],
    comparison: {
      title: 'UDP vs TCP',
      headers: ['구분', 'UDP', 'TCP'],
      rows: [
        ['연결 방식', '비연결형', '연결지향 (3-way handshake)'],
        ['신뢰성', '보장 안 함', '보장 (재전송 · 순서)'],
        ['헤더 크기', '8바이트', '20~60바이트'],
        ['흐름·혼잡 제어', '없음', '있음'],
        ['속도', '빠름 (오버헤드 작음)', '상대적으로 느림'],
        ['대표 용도', 'DNS·DHCP·스트리밍·게임', '웹·이메일·파일 전송'],
      ],
    },
    properties: [
      '헤더가 8바이트로 고정되어 처리가 빠르다',
      '연결 설정/해제가 없어 작은 요청-응답에서 지연이 적다',
      '패킷이 훼손되면 그냥 폐기하고, 송신 측에 어떤 피드백도 보내지 않는다',
      '순서·중복·손실을 처리하지 않으므로, 필요하면 응용 프로그램이 직접 해야 한다',
      '목적지 포트의 큐가 없으면 ICMP "port unreachable"을 보내고 데이터그램을 폐기',
    ],
    code: {
      pseudo: `UDP 송신 (fire-and-forget)
  데이터그램 = 만들기(발신지포트, 목적지포트, 데이터)
  데이터그램.checksum = 계산(의사헤더 + 헤더 + 데이터)
  IP로 전송(데이터그램)
  # 끝 — 확인응답을 기다리지 않음

UDP 수신
  데이터그램 수신
  IF checksum 불일치:
      데이터그램 폐기            # 재전송 요청 없음
  ELSE:
      포트번호로 프로세스 큐에 전달`,
      python: `# UDP 소켓 — 연결 없이 바로 송수신
import socket

# 송신
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)  # DGRAM = UDP
s.sendto(b'hello', ('203.0.113.7', 9999))   # 연결 설정이 없음

# 수신
r = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
r.bind(('0.0.0.0', 9999))
data, addr = r.recvfrom(1024)               # 각 데이터그램은 독립적
print(data, 'from', addr)`,
    },
    useCases: ['DNS — 짧은 질의/응답', 'DHCP — IP 주소 자동 할당', '실시간 스트리밍·화상통화', '온라인 게임', 'SNMP — 네트워크 장치 관리'],
  },

  // ── TCP ───────────────────────────────────────────────────────
  {
    id: 'tcp', name: 'TCP', subtitle: 'Transmission Control Protocol',
    emoji: '🤝', color: '#10b981', category: 'transport',
    tagline: '신뢰할 수 있는 연결 — 3-way handshake의 주인공',
    concept: [
      '**TCP(Transmission Control Protocol)**는 신뢰성 있는 연결지향 전송 계층 프로토콜입니다. 데이터를 보내기 전에 **3-way handshake**로 가상 연결을 먼저 설정합니다.',
      'TCP는 데이터를 **바이트 스트림**으로 다룹니다. 모든 바이트에 번호를 매기고, 일정량을 묶어 **세그먼트**로 만들어 IP에 전달합니다.',
      '순서 번호·확인응답·재전송으로 **신뢰성**을, 슬라이딩 윈도우로 **흐름 제어**를, 혼잡 윈도우로 **혼잡 제어**를 수행합니다. 양방향 동시 전송(전이중)도 지원합니다.',
    ],
    keyPoints: [
      '연결지향 — 3-way handshake로 연결 설정',
      '바이트 스트림 — 모든 바이트에 번호 부여',
      '신뢰성 — 순서 번호 · ACK · 재전송',
      '흐름 제어 — 슬라이딩 윈도우(rwnd)',
      '혼잡 제어 — 혼잡 윈도우(cwnd)',
    ],
    terminology: [
      { term: 'TCP', def: '신뢰성 있는 연결지향 전송 계층 프로토콜' },
      { term: '세그먼트', def: 'Segment — TCP가 바이트들을 묶어 만든 패킷. IP 데이터그램에 캡슐화' },
      { term: '순서 번호', def: 'Sequence number — 세그먼트 첫 데이터 바이트에 부여된 번호. 순서를 맞추는 기준' },
      { term: '확인응답 번호', def: 'Acknowledgment number — 다음에 받기를 기대하는 바이트 번호. 수신한 바이트 번호 + 1' },
      { term: '3-way handshake', def: 'SYN → SYN+ACK → ACK 세 단계로 연결을 설정하는 절차' },
      { term: 'SYN과 ACK과 FIN', def: '제어 플래그 — SYN은 연결 요청, ACK은 확인응답, FIN은 연결 종료' },
      { term: '흐름 제어', def: 'Flow control — 수신자가 감당할 만큼만 보내도록 송신 속도를 조절. rwnd 사용' },
      { term: '혼잡 제어', def: 'Congestion control — 네트워크 혼잡을 피하려 송신량을 조절. cwnd 사용' },
    ],
    mechanism: {
      description: 'TCP는 데이터를 보내기 전에 3-way handshake로 가상 연결을 설정합니다.',
      steps: [
        { title: '① SYN', desc: '클라이언트가 SYN=1 세그먼트를 전송(seq=x). 능동 개방 — 데이터는 없지만 순서번호 1개를 소비' },
        { title: '② SYN + ACK', desc: '서버가 SYN=1·ACK=1 세그먼트로 응답(seq=y, ack=x+1). 수동 개방 상태에서 연결을 수락' },
        { title: '③ ACK', desc: '클라이언트가 ACK=1 세그먼트를 전송(seq=x+1, ack=y+1). 연결 확립(ESTABLISHED)' },
        { title: '데이터 전송', desc: '양방향 바이트 스트림 전송. 데이터와 확인응답을 함께 싣는 피기백킹(piggybacking) 사용' },
        { title: '연결 종료', desc: 'FIN → ACK → FIN → ACK 네 단계로 양쪽 방향을 각각 닫음' },
      ],
    },
    representation: [
      { title: '발신지·목적지 포트 (각 16비트)', desc: '통신하는 두 프로세스의 포트 번호' },
      { title: '순서 번호 (32비트)', desc: '세그먼트 첫 데이터 바이트의 번호' },
      { title: '확인응답 번호 (32비트)', desc: '상대로부터 다음에 받기를 기대하는 바이트 번호' },
      { title: '제어 플래그 (6비트)', desc: 'URG · ACK · PSH · RST · SYN · FIN' },
      { title: '윈도우 크기 (16비트)', desc: '수신자가 받을 수 있는 데이터 양(rwnd) — 최대 65535바이트' },
      { title: '검사합 (16비트)', desc: '오류 검출 — 필수이며 의사 헤더를 포함해 계산. 기본 헤더는 20바이트' },
    ],
    comparison: {
      title: 'UDP vs TCP',
      headers: ['구분', 'UDP', 'TCP'],
      rows: [
        ['연결', '비연결형', '연결지향'],
        ['신뢰성', '없음', '있음 — 재전송·순서 보장'],
        ['헤더', '8바이트', '20~60바이트'],
        ['전송 단위', '사용자 데이터그램', '세그먼트 (바이트 스트림)'],
        ['제어', '없음', '흐름 · 오류 · 혼잡 제어'],
        ['용도', '실시간·짧은 메시지', '정확성이 중요한 전송'],
      ],
    },
    properties: [
      '연결을 먼저 설정하므로, 첫 데이터를 보내기까지 최소 1.5 RTT가 든다',
      '누적 확인응답 — ACK 번호는 "다음에 기대하는 바이트"를 알려준다',
      '재전송: 타임아웃(RTO) 또는 3개의 중복 ACK 수신 시 빠른 재전송(fast retransmission)',
      '실제 송신 윈도우 = min(rwnd, cwnd) — 수신자와 네트워크 중 더 작은 쪽을 따른다',
      '혼잡 제어는 느린 시작(지수 증가) → 혼잡 회피(가산 증가) 순으로 동작한다',
      '윈도우 크기 필드는 16비트(최대 65535바이트)지만, 윈도우 스케일 옵션을 쓰면 더 크게 확장할 수 있다',
    ],
    code: {
      pseudo: `3-way handshake (연결 설정)
  클라이언트 → 서버 : SYN,       seq=x
  서버 → 클라이언트 : SYN+ACK,   seq=y, ack=x+1
  클라이언트 → 서버 : ACK,       seq=x+1, ack=y+1
  → 상태: ESTABLISHED

연결 종료 (4-way)
  능동 → 수동 : FIN
  수동 → 능동 : ACK
  수동 → 능동 : FIN
  능동 → 수동 : ACK`,
      python: `# TCP 소켓 — connect()가 3-way handshake를 수행
import socket

# 서버
srv = socket.socket(socket.AF_INET, socket.SOCK_STREAM)  # STREAM = TCP
srv.bind(('0.0.0.0', 8080))
srv.listen()
conn, addr = srv.accept()        # handshake 완료 후 연결 반환
conn.sendall(b'hello')

# 클라이언트
cli = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
cli.connect(('203.0.113.7', 8080))   # SYN → SYN+ACK → ACK
print(cli.recv(1024))`,
    },
    useCases: ['HTTP/HTTPS — 웹 페이지 전송', '파일 다운로드(FTP)', '이메일(SMTP·POP3·IMAP)', 'SSH 원격 접속', '정확성이 중요한 모든 전송'],
  },

  // ── 응용 계층 ─────────────────────────────────────────────────
  {
    id: 'application', name: '응용 계층', subtitle: 'Application Layer',
    emoji: '🌐', color: '#ec4899', category: 'application',
    tagline: '사용자와 가장 가까운 계층 — 클라이언트·서버와 P2P',
    concept: [
      '**응용 계층(Application Layer)**은 하위 계층을 이용해 사용자에게 편리한 **응용 서비스**를 제공하는 최상위 계층입니다. 웹·이메일·파일 전송이 모두 여기서 동작합니다.',
      '인터넷 응용의 대부분은 **클라이언트-서버 패러다임**으로 설계됩니다. 서버는 서비스를 제공하고, 클라이언트는 서비스를 요청합니다.',
      '클라이언트-서버 외에, 두 대등 컴퓨터가 서로 서비스를 주고받는 **Peer-to-Peer(P2P)** 패러다임도 있습니다.',
    ],
    keyPoints: [
      '사용자에게 응용 서비스를 제공하는 최상위 계층',
      '클라이언트-서버 패러다임이 가장 보편적',
      '서버 = 무한 프로그램 / 클라이언트 = 유한 프로그램',
      '서버: 비연결형 반복형(UDP) · 연결형 동시형(TCP)',
      'P2P — 대등한 컴퓨터끼리 직접 서비스 교환',
    ],
    terminology: [
      { term: '응용 계층', def: '하위 계층을 이용해 사용자에게 응용 서비스를 제공하는 최상위 계층' },
      { term: '서버', def: 'Server — 원격에서 동작하며 클라이언트에 서비스를 제공하는 무한 프로그램' },
      { term: '클라이언트', def: 'Client — 서비스를 요청하고, 완료되면 종료하는 유한 프로그램' },
      { term: '무한 프로그램', def: 'Infinite — 한 번 시작되면 문제가 없는 한 계속 실행되는 서버 프로그램' },
      { term: '유한 프로그램', def: 'Finite — 요청 시 시작했다가 서비스가 끝나면 종료되는 클라이언트 프로그램' },
      { term: '반복적 서버', def: 'Iterative server — 한 순간에 하나의 요청만 처리하는 서버' },
      { term: '동시적 서버', def: 'Concurrent server — 여러 요청을 동시에 처리하는 서버' },
      { term: 'Peer-to-Peer', def: 'P2P — 대등한 두 컴퓨터가 서버를 거치지 않고 직접 서비스를 교환하는 방식' },
    ],
    classification: [
      { name: '비연결형 반복 서버', desc: 'UDP 사용 — 한 번에 하나의 요청만 처리. 데이터그램으로 요청을 받아 처리한 뒤 응답' },
      { name: '연결형 동시 서버', desc: 'TCP 사용 — 여러 클라이언트를 동시에 처리. 연결마다 자식 서버가 포트를 받아 처리' },
      { name: '클라이언트-서버', desc: '하나의 서버가 다수 클라이언트에 서비스 — 오늘날 가장 보편적' },
      { name: 'Peer-to-Peer (P2P)', desc: '서버 없이 대등 컴퓨터끼리 직접 통신 — 같은 컴퓨터가 클라이언트도 서버도 될 수 있음' },
    ],
    mechanism: {
      description: '클라이언트-서버 모델에서 요청과 응답이 오가는 과정입니다.',
      steps: [
        { title: '서버 대기', desc: '서버 프로세스가 먼저 실행되어, 잘 알려진 포트에서 연결 요청을 기다림 (수동 개방)' },
        { title: '클라이언트 요청', desc: '사용자가 클라이언트를 실행하면 서버의 포트로 연결·요청 메시지를 전송' },
        { title: '서버 처리', desc: '서버가 요청을 받아 처리 — 동시적 서버는 자식 프로세스에 맡겨 여러 요청을 병행' },
        { title: '응답 전송', desc: '서버가 처리 결과를 응답 메시지로 클라이언트에 전송' },
        { title: '종료', desc: '클라이언트는 서비스가 끝나면 종료(유한), 서버는 계속 다음 요청을 대기(무한)' },
      ],
    },
    comparison: {
      title: '주요 응용 계층 프로토콜',
      headers: ['프로토콜', '포트', '역할'],
      rows: [
        ['HTTP', 'TCP 80', '웹 페이지(하이퍼텍스트) 송수신'],
        ['HTTPS', 'TCP 443', '암호화된 웹 전송'],
        ['FTP', 'TCP 20·21', '파일 전송'],
        ['SMTP', 'TCP 25', '이메일 송신'],
        ['POP3 · IMAP', 'TCP 110 · 143', '이메일 수신·저장'],
        ['DNS', 'TCP/UDP 53', '도메인 이름 ↔ IP 변환'],
        ['DHCP', 'UDP 67·68', 'IP 주소 자동 할당'],
      ],
    },
    properties: [
      '응용 계층은 사용자 프로그램 환경에서 구현되며, OS가 제공하는 전송 계층 인터페이스(소켓)를 이용한다',
      '서버는 클라이언트보다 먼저 실행되어, 항상 대기 상태에 있어야 한다',
      '반복적 서버는 단순하지만 한 번에 한 요청만, 동시적 서버는 복잡하지만 다수 요청을 병행 처리한다',
      '잘 알려진 포트는 연결 설정에만 쓰이고, 실제 통신은 자식 서버의 임시 포트로 진행된다',
      'P2P는 서버 부담 없이 확장되지만, 클라이언트-서버가 여전히 가장 보편적이다',
    ],
    code: {
      pseudo: `클라이언트-서버 동작
  [서버]  무한 프로그램
      포트 바인딩(well-known port)
      LOOP 영원히:
          요청 = 수신()
          응답 = 처리(요청)
          전송(응답)

  [클라이언트]  유한 프로그램
      서버에 연결 / 요청 전송
      응답 = 수신()
      출력(응답)
      종료`,
      python: `# 간단한 클라이언트-서버 (TCP)
import socket

# --- 서버: 무한 프로그램 ---
srv = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
srv.bind(('0.0.0.0', 8080))
srv.listen()
while True:                       # 영원히 대기
    conn, addr = srv.accept()
    req = conn.recv(1024)
    conn.sendall(b'echo: ' + req)
    conn.close()

# --- 클라이언트: 유한 프로그램 ---
cli = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
cli.connect(('203.0.113.7', 8080))
cli.sendall(b'hello')
print(cli.recv(1024))
cli.close()                       # 서비스 끝 → 종료`,
    },
    useCases: ['웹 브라우징(HTTP/HTTPS)', '이메일(SMTP·POP3·IMAP)', '파일 공유·토렌트(P2P)', 'DNS 이름 해석', '메신저·화상회의'],
  },
]
