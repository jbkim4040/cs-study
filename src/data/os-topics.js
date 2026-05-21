export const CATEGORIES = [
  { id: 'process', label: '프로세스 · 스레드', ids: ['process', 'thread', 'scheduling', 'sync', 'ipc', 'deadlock'] },
  { id: 'memory',  label: '메모리 관리',       ids: ['memory', 'paging', 'segmentation', 'virtualmemory', 'pagereplace'] },
  { id: 'storage', label: '저장장치 · 파일',   ids: ['filesystem', 'diskscheduling'] },
]

export const TOPICS = [
  // ── 프로세스 ──────────────────────────────────────────────────
  {
    id: 'process', name: '프로세스', subtitle: 'Process',
    emoji: '⚙️', color: '#6366f1', category: 'process',
    tagline: '실행 중인 프로그램 — OS가 자원을 할당하는 기본 단위',
    concept: [
      '**프로세스(Process)**는 실행 중인 프로그램의 인스턴스입니다. 디스크에 저장된 정적인 프로그램과 달리, 메모리에 적재되어 CPU가 실행하는 능동적 개체입니다.',
      'OS는 각 프로세스마다 **PCB(Process Control Block)**를 만들어 상태·레지스터·메모리 정보 등을 관리합니다.',
      '프로세스는 생성-준비-실행-대기-종료의 **상태(state)**를 거치며, 상태 전이는 OS 스케줄러가 제어합니다.',
    ],
    keyPoints: [
      '프로그램 = 정적 / 프로세스 = 실행 중인 동적 개체',
      'PCB — 프로세스 메타데이터 저장소',
      '메모리 구조: 코드 · 데이터 · 힙 · 스택',
      '5가지 상태: 생성 · 준비 · 실행 · 대기 · 종료',
      '문맥 교환(Context Switch)으로 CPU를 번갈아 사용',
    ],
    terminology: [
      { term: 'PCB', def: '프로세스의 상태·PC·레지스터·메모리 정보·PID 등을 담는 자료구조' },
      { term: 'PID', def: '프로세스를 식별하는 고유 번호' },
      { term: '문맥 교환 (Context Switch)', def: '실행 중인 프로세스를 멈추고 다른 프로세스로 CPU를 넘기는 작업 — PCB 저장·복원' },
      { term: '프로세스 메모리 영역', def: '코드(텍스트) · 데이터 · 힙 · 스택의 4개 영역으로 구성' },
      { term: '부모 / 자식 프로세스', def: 'fork()로 생성된 프로세스 간 계층 관계' },
      { term: '디스패치 (Dispatch)', def: '준비 상태의 프로세스를 실행 상태로 전환하는 작업' },
    ],
    mechanism: {
      description: '프로세스는 5가지 상태를 순환하며, 각 전이는 OS가 제어합니다.',
      steps: [
        { title: '생성 (New)', desc: '프로세스가 만들어지고 PCB가 할당됨. 아직 메모리에 완전히 적재 전' },
        { title: '준비 (Ready)', desc: 'CPU 할당만 기다리는 상태. 준비 큐에서 대기' },
        { title: '실행 (Running)', desc: 'CPU를 점유해 명령어를 실행 중. 한 코어에 하나만 존재' },
        { title: '대기 (Waiting)', desc: 'I/O 등 이벤트 완료를 기다림. CPU를 반납한 상태' },
        { title: '종료 (Terminated)', desc: '실행 완료. 자원을 회수하고 PCB를 제거' },
      ],
    },
    classification: [
      { name: 'CPU 바운드', desc: '계산 위주 — CPU 사용 시간이 길다' },
      { name: 'I/O 바운드', desc: '입출력 위주 — 대기 상태가 잦다' },
      { name: '포그라운드 / 백그라운드', desc: '사용자와의 상호작용 여부로 구분' },
      { name: '독립 / 협력 프로세스', desc: '다른 프로세스와 데이터를 공유하는지로 구분' },
    ],
    properties: [
      '한 CPU 코어는 한 순간에 하나의 프로세스만 실행 — 실행 상태는 코어당 1개',
      '준비·대기 상태에는 여러 프로세스가 동시에 존재할 수 있음',
      '문맥 교환은 순수한 오버헤드 — 교환 중 CPU는 유용한 작업을 하지 못함',
      'fork() 시 자식은 부모의 메모리 공간을 복사 (copy-on-write로 최적화)',
    ],
    code: {
      pseudo: `프로세스 상태 전이
  admit:     New     → Ready        프로세스 수용
  dispatch:  Ready   → Running      CPU 할당
  timeout:   Running → Ready        타임 슬라이스 소진 (선점)
  I/O 요청:   Running → Waiting      입출력 시작
  I/O 완료:   Waiting → Ready        입출력 종료
  exit:      Running → Terminated   실행 완료`,
      c: `#include <unistd.h>
#include <sys/wait.h>
#include <stdio.h>

int main() {
    pid_t pid = fork();              // 프로세스 생성

    if (pid == 0) {                  // 자식 프로세스
        printf("자식: PID=%d\\n", getpid());
    } else if (pid > 0) {            // 부모 프로세스
        printf("부모: 자식 PID=%d\\n", pid);
        wait(NULL);                  // 자식 종료를 대기
    }
    return 0;
}`,
    },
    useCases: ['웹 브라우저 탭별 프로세스 격리', '셸의 명령어 실행', '서버의 요청별 워커 프로세스', 'OS 부팅 시 init / systemd'],
  },

  // ── 스레드 ────────────────────────────────────────────────────
  {
    id: 'thread', name: '스레드', subtitle: 'Thread',
    emoji: '🧵', color: '#8b5cf6', category: 'process',
    tagline: '프로세스 안에서 자원을 공유하며 실행되는 흐름의 단위',
    concept: [
      '**스레드(Thread)**는 프로세스 내부에서 실제로 CPU가 실행하는 흐름의 단위입니다. 한 프로세스는 여러 스레드를 가질 수 있습니다.',
      '같은 프로세스의 스레드들은 **코드·데이터·힙을 공유**하고, **스택·레지스터·PC는 각자** 따로 가집니다.',
      '자원을 공유하므로 문맥 교환·통신 비용이 프로세스보다 훨씬 저렴합니다.',
    ],
    keyPoints: [
      '공유: 코드 · 데이터 · 힙 · 열린 파일',
      '독립: 스택 · 레지스터 · PC(프로그램 카운터)',
      '스레드 간 통신은 공유 메모리로 빠름',
      '멀티스레딩으로 응답성 · 병렬성 향상',
      '공유 자원 → 동기화 문제 발생',
    ],
    terminology: [
      { term: '멀티스레딩', def: '한 프로세스가 여러 스레드로 작업을 동시에 진행' },
      { term: '사용자 스레드', def: '사용자 라이브러리가 관리 — 빠르지만 한 스레드가 블록되면 전체 블록' },
      { term: '커널 스레드', def: 'OS 커널이 직접 관리 — 진정한 병렬, 문맥 교환 비용이 큼' },
      { term: 'TCB (Thread Control Block)', def: '스레드별 레지스터·스택 포인터·상태를 저장하는 구조' },
      { term: '동시성 (Concurrency)', def: '여러 작업이 번갈아 진행되어 동시에 처리되는 것처럼 보임' },
      { term: '병렬성 (Parallelism)', def: '여러 코어에서 작업이 실제로 동시에 실행됨' },
    ],
    mechanism: {
      description: '사용자 스레드와 커널 스레드를 매핑하는 3가지 멀티스레딩 모델',
      steps: [
        { title: '다대일 (N:1)', desc: '여러 사용자 스레드를 커널 스레드 1개에 매핑. 한 스레드가 블록되면 전체가 블록' },
        { title: '일대일 (1:1)', desc: '사용자 스레드마다 커널 스레드 1개. 진정한 병렬 가능, 생성 비용이 큼 (Linux·Windows)' },
        { title: '다대다 (N:M)', desc: '여러 사용자 스레드를 더 적은 커널 스레드에 매핑. 유연하나 구현이 복잡' },
      ],
    },
    comparison: {
      title: '프로세스 vs 스레드',
      headers: ['구분', '프로세스', '스레드'],
      rows: [
        ['메모리', '독립적 — 별도 주소 공간', '공유 — 코드·데이터·힙'],
        ['생성 비용', '큼 (주소 공간 전체)', '작음 (스택만 할당)'],
        ['문맥 교환', '느림 (주소 공간 전환)', '빠름'],
        ['통신', 'IPC 필요 (파이프·소켓 등)', '공유 메모리로 직접'],
        ['안정성', '한 프로세스 충돌이 격리됨', '한 스레드 충돌 → 프로세스 전체 영향'],
      ],
    },
    properties: [
      '한 프로세스가 충돌하면 그 안의 모든 스레드가 함께 종료됨',
      '모든 프로세스는 최소 1개의 스레드(메인 스레드)를 가짐',
      '스택은 스레드마다 독립 — 지역 변수는 스레드별로 분리됨',
      '힙·전역 변수는 공유 → 동시 접근 시 동기화가 필수',
    ],
    code: {
      pseudo: `스레드 메모리 모델

  공유 영역  (프로세스 전체가 공유)
    ├─ 코드 (텍스트)
    ├─ 데이터 (전역 변수)
    └─ 힙

  독립 영역  (스레드마다 따로)
    ├─ 스택
    ├─ 레지스터
    └─ PC (프로그램 카운터)`,
      c: `#include <pthread.h>
#include <stdio.h>

void *worker(void *arg) {
    int id = *(int *)arg;
    printf("스레드 %d 실행\\n", id);
    return NULL;
}

int main() {
    pthread_t t[3];
    int ids[3] = {0, 1, 2};

    for (int i = 0; i < 3; i++)               // 스레드 3개 생성
        pthread_create(&t[i], NULL, worker, &ids[i]);

    for (int i = 0; i < 3; i++)               // 모든 스레드 종료 대기
        pthread_join(t[i], NULL);
    return 0;
}`,
    },
    useCases: ['웹 서버의 요청별 스레드', 'UI 스레드 + 백그라운드 작업 스레드', '게임의 렌더링·물리·입력 분리', '병렬 행렬 연산'],
  },

  // ── CPU 스케줄링 ──────────────────────────────────────────────
  {
    id: 'scheduling', name: 'CPU 스케줄링', subtitle: 'CPU Scheduling',
    emoji: '⏱️', color: '#3b82f6', category: 'process',
    tagline: '준비 큐의 어떤 프로세스에 CPU를 줄지 결정하는 정책',
    concept: [
      '**CPU 스케줄링**은 준비 상태의 여러 프로세스 중 다음에 CPU를 할당받을 프로세스를 선택하는 작업입니다.',
      '**선점(Preemptive)** 스케줄링은 실행 중인 프로세스를 강제로 멈출 수 있고, **비선점(Non-preemptive)**은 프로세스가 자발적으로 CPU를 놓을 때까지 기다립니다.',
      '목표는 CPU 이용률·처리량은 높이고, 대기 시간·응답 시간은 낮추는 것입니다.',
    ],
    keyPoints: [
      'FCFS — 도착 순서대로 (비선점)',
      'SJF — 실행 시간이 짧은 순 (평균 대기 최소)',
      'RR — 타임 퀀텀 단위 순환 (선점, 응답성↑)',
      'Priority — 우선순위 높은 순 (기아 가능)',
      '평가 지표: 대기 시간 · 반환 시간 · 응답 시간',
    ],
    terminology: [
      { term: '도착 시간 (Arrival Time)', def: '프로세스가 준비 큐에 들어온 시각' },
      { term: '실행 시간 (Burst Time)', def: '프로세스가 CPU를 필요로 하는 총 시간' },
      { term: '대기 시간 (Waiting Time)', def: '준비 큐에서 기다린 총 시간' },
      { term: '반환 시간 (Turnaround Time)', def: '도착부터 종료까지의 전체 시간 = 대기 시간 + 실행 시간' },
      { term: '응답 시간 (Response Time)', def: '도착부터 처음 CPU를 받기까지 걸린 시간' },
      { term: '타임 퀀텀 (Time Quantum)', def: 'RR에서 한 프로세스가 연속으로 CPU를 쓸 수 있는 시간' },
      { term: '기아 (Starvation)', def: '우선순위가 낮아 무한정 CPU를 받지 못하는 현상' },
    ],
    comparison: {
      title: '주요 CPU 스케줄링 알고리즘',
      headers: ['알고리즘', '선점', '선택 기준', '특징'],
      rows: [
        ['FCFS', '비선점', '도착 순서', '단순 / 호위 효과(convoy)'],
        ['SJF', '비선점', '최소 실행 시간', '평균 대기 최소 / 실행 시간 예측 어려움'],
        ['SRTF', '선점', '최소 잔여 시간', 'SJF의 선점 버전'],
        ['RR', '선점', '타임 퀀텀 순환', '응답성 우수 / 퀀텀 크기에 민감'],
        ['Priority', '둘 다 가능', '우선순위', '기아 가능 → 에이징으로 완화'],
      ],
    },
    properties: [
      'SJF는 평균 대기 시간이 이론적으로 최소 — 단, 실행 시간을 미리 알아야 함',
      'RR의 타임 퀀텀이 너무 크면 FCFS와 같아지고, 너무 작으면 문맥 교환 오버헤드가 폭증',
      'FCFS는 긴 프로세스가 앞에 오면 뒤가 모두 밀리는 호위 효과(convoy effect)가 발생',
      '에이징(aging): 오래 기다린 프로세스의 우선순위를 점차 높여 기아를 방지',
    ],
    code: {
      pseudo: `스케줄링 평가 지표
  반환 시간 = 종료 시각 − 도착 시각
  대기 시간 = 반환 시간 − 실행 시간
  평균 대기 시간 = Σ(대기 시간) / 프로세스 수

라운드 로빈 (Round Robin)
  while 준비 큐가 비어있지 않음:
      p ← 준비 큐에서 꺼냄
      실행(p, min(타임_퀀텀, p.잔여시간))
      if p.잔여시간 > 0:
          준비 큐에 다시 넣음          # 선점
      else:
          p 종료`,
      c: `// FCFS — 도착 순서대로 대기 시간 계산
#include <stdio.h>

void fcfs(int n, int burst[]) {
    int wait[100];
    wait[0] = 0;
    for (int i = 1; i < n; i++)
        wait[i] = wait[i-1] + burst[i-1];   // 앞 프로세스들의 실행 합

    int total = 0;
    for (int i = 0; i < n; i++) total += wait[i];
    printf("평균 대기 시간: %.2f\\n", (float)total / n);
}`,
    },
    useCases: ['OS 커널의 CPU 디스패처', '실시간 시스템(우선순위 기반)', '리눅스 CFS 스케줄러', '배치 처리 시스템'],
  },

  // ── 프로세스 동기화 ───────────────────────────────────────────
  {
    id: 'sync', name: '프로세스 동기화', subtitle: 'Synchronization',
    emoji: '🔐', color: '#06b6d4', category: 'process',
    tagline: '공유 자원에 대한 동시 접근을 안전하게 조율하는 기법',
    concept: [
      '여러 프로세스나 스레드가 **공유 자원**에 동시에 접근하면, 실행 순서에 따라 결과가 달라지는 **경쟁 상태(Race Condition)**가 발생합니다.',
      '공유 자원을 다루는 코드 영역을 **임계 구역(Critical Section)**이라 하며, 한 번에 하나의 실행 흐름만 진입해야 합니다.',
      '세마포어·뮤텍스·모니터 같은 동기화 도구로 **상호 배제(Mutual Exclusion)**를 보장합니다.',
    ],
    keyPoints: [
      '경쟁 상태 — 실행 순서에 따라 결과가 달라짐',
      '임계 구역 — 공유 자원 접근 코드, 한 번에 하나만',
      '해결 3조건: 상호 배제 · 진행 · 한정 대기',
      '뮤텍스(0/1 잠금) / 세마포어(정수 카운터)',
      '잘못된 동기화 → 교착 상태 위험',
    ],
    terminology: [
      { term: '경쟁 상태 (Race Condition)', def: '여러 실행 흐름의 접근 순서에 따라 결과가 달라지는 오류' },
      { term: '임계 구역 (Critical Section)', def: '공유 자원에 접근하는 코드 영역' },
      { term: '상호 배제 (Mutual Exclusion)', def: '한 번에 하나의 프로세스만 임계 구역에 진입' },
      { term: '세마포어 (Semaphore)', def: '정수 카운터로 자원 개수를 관리 — wait(P)/signal(V) 연산' },
      { term: '뮤텍스 (Mutex)', def: '0 또는 1만 갖는 잠금 — 잠근 주체만 해제할 수 있는 소유 개념' },
      { term: '모니터 (Monitor)', def: '동기화를 언어 수준에서 캡슐화한 고수준 도구' },
      { term: '바쁜 대기 (Busy Waiting)', def: '진입 가능할 때까지 반복 검사하며 CPU를 소모하는 방식' },
    ],
    mechanism: {
      description: '세마포어는 정수 S와 두 개의 원자적 연산으로 동작합니다.',
      steps: [
        { title: 'wait(S) / P 연산', desc: 'S를 1 감소. S < 0이면 호출 프로세스를 블록하고 대기 큐로 보냄' },
        { title: '임계 구역 진입', desc: 'wait를 통과한 프로세스만 공유 자원에 접근' },
        { title: 'signal(S) / V 연산', desc: 'S를 1 증가. 대기 중인 프로세스가 있으면 하나를 깨움' },
        { title: '원자성 보장', desc: 'wait·signal은 중간에 끼어들 수 없는 원자적 연산이어야 함' },
      ],
    },
    comparison: {
      title: '뮤텍스 vs 세마포어',
      headers: ['구분', '뮤텍스', '세마포어'],
      rows: [
        ['값의 범위', '0 / 1 (이진)', '0 이상의 정수'],
        ['용도', '하나의 자원 보호', 'N개 자원 또는 신호 전달'],
        ['소유권', '잠근 스레드만 해제 가능', '소유 개념 없음 — 누구나 signal'],
        ['예시', '공유 변수 보호', '버퍼 N칸, 생산자-소비자'],
      ],
    },
    properties: [
      '임계 구역 해결의 3요구조건: ① 상호 배제 ② 진행(Progress) ③ 한정 대기(Bounded Waiting)',
      '계수 세마포어는 0 이상의 정수, 이진 세마포어는 0 또는 1만 가짐',
      'wait/signal이 원자적이지 않으면 세마포어 자체에 경쟁 상태가 생김',
      '바쁜 대기를 피하려면 블록-깨우기(block-wakeup) 방식의 세마포어를 사용',
    ],
    code: {
      pseudo: `세마포어 정의
  wait(S):   S ← S − 1;  if S < 0: 호출 프로세스를 블록
  signal(S): S ← S + 1;  if S ≤ 0: 대기 중 프로세스 하나를 깨움

임계 구역 보호  (mutex 초기값 = 1)
  wait(mutex)        # 진입 — 잠금 획득
      임계 구역      # 공유 자원에 접근
  signal(mutex)      # 진출 — 잠금 해제`,
      c: `#include <pthread.h>

pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;
int counter = 0;                       // 공유 자원

void *increment(void *arg) {
    for (int i = 0; i < 100000; i++) {
        pthread_mutex_lock(&lock);     // 임계 구역 진입
        counter++;                     // 안전하게 갱신
        pthread_mutex_unlock(&lock);   // 임계 구역 진출
    }
    return NULL;
}`,
    },
    useCases: ['은행 계좌 잔액 동시 갱신', '생산자-소비자 버퍼', '데이터베이스 트랜잭션 잠금', '공유 카운터·통계 집계'],
  },

  // ── 프로세스 간 통신 (IPC) ────────────────────────────────────
  {
    id: 'ipc', name: '프로세스 간 통신', subtitle: 'IPC',
    emoji: '📨', color: '#d946ef', category: 'process',
    tagline: '독립된 프로세스끼리 데이터를 주고받는 통신 기법',
    concept: [
      '프로세스는 서로 **독립적**이라 다른 프로세스의 메모리 영역에 직접 접근할 수 없습니다. **IPC(Inter-Process Communication)**는 이런 프로세스들이 데이터를 주고받게 해주는 기법입니다.',
      '데이터를 주고받으려면 양쪽이 함께 쓰는 **공유 메모리**가 필요합니다 — 커널 영역에 두거나 사용자 영역에 둡니다.',
      '공유 메모리가 **커널 영역**이면 OS가 동기화를 대신 해주고, **사용자 영역**이면 프로그램이 직접 동기화(임계 구역 보호)해야 합니다.',
    ],
    keyPoints: [
      '프로세스는 독립적 — 메모리를 직접 공유 불가',
      '3대 기법: 파이프 · 메시지 큐 · 공유 메모리',
      '커널 영역 공유 → OS 동기화 / 사용자 영역 → 직접 동기화',
      '공통 과정: 공유 메모리 확보 → 사용 → 반납',
      '공유 메모리 방식이 가장 빠름 (복사 없음)',
    ],
    terminology: [
      { term: '파이프 (Pipe)', def: '커널 영역에 만드는 단방향 통신 채널 — 양방향은 파이프 2개 사용' },
      { term: '이름 없는 파이프', def: '부모-자식 프로세스 사이에서만 쓰는 파이프 (예: ps -ef | more)' },
      { term: '이름 있는 파이프 (FIFO)', def: '파일 이름이 있어 임의 프로세스끼리 통신 — 파일 삭제 전까지 영구적' },
      { term: '메시지 큐 (Message Queue)', def: '커널에 만들어 메시지 단위로 송수신하는 큐 — 메시지마다 타입이 있음' },
      { term: '공유 메모리 (Shared Memory)', def: '사용자 영역의 메모리를 여러 프로세스가 함께 사용 — IPC 중 가장 빠름' },
      { term: '메시지 전송 (Message Passing)', def: 'send()/receive()로 메시지를 복사해 전달 — OS가 동기화 담당' },
      { term: '파일 디스크립터', def: '파이프·파일을 가리키는 정수 핸들 (fd[0] 읽기, fd[1] 쓰기)' },
    ],
    mechanism: {
      description: '대부분의 IPC는 공유 공간을 확보 → 사용 → 반납하는 3단계를 거칩니다.',
      steps: [
        { title: '① 공유 메모리 확보', desc: '커널이나 사용자 영역에 통신용 공간을 생성 (pipe · msgget · shmget)' },
        { title: '② 공유 메모리 사용', desc: '한쪽이 데이터를 쓰고(write/send) 다른 쪽이 읽음(read/receive)' },
        { title: '③ 공유 메모리 반납', desc: '통신이 끝나면 채널·공간을 해제 (close · msgctl · shmctl)' },
      ],
    },
    comparison: {
      title: 'IPC 기법 비교',
      headers: ['기법', '공유 메모리 위치', '동기화', '특징'],
      rows: [
        ['이름 없는 파이프', '커널 영역', 'OS가 처리', '부모-자식 간만 / 채널이 일시적'],
        ['이름 있는 파이프(FIFO)', '커널 영역', 'OS가 처리', '임의 프로세스 / 파일로 영구적'],
        ['메시지 큐', '커널 영역', 'OS가 처리', '메시지 단위 송수신 / 타입 존재'],
        ['공유 메모리', '사용자 영역', '직접 동기화 필요', '가장 빠름 / 임계 구역 발생'],
      ],
    },
    properties: [
      '공유 메모리 방식은 가장 빠르지만, 사용자 영역이라 세마포어 등으로 직접 동기화해야 함',
      '파이프·메시지 큐는 커널이 동기화를 대신 처리해 사용이 비교적 간단함',
      '이름 없는 파이프는 부모-자식 간에만 가능하고 프로세스 종료 시 사라짐 — 영구적이지 않음',
      '이름 있는 파이프(FIFO)는 파일이므로 무관한 프로세스끼리도, 파일 삭제 전까지 통신 가능',
      '동기화 없이 공유 메모리를 함께 쓰면 경쟁 상태가 생겨 결과가 깨짐',
    ],
    code: {
      pseudo: `IPC 공통 흐름
  확보:  채널·공유 공간 생성   (pipe / msgget / shmget)
  사용:  송신 ─ write / msgsnd / 공유 메모리에 쓰기
         수신 ─ read  / msgrcv / 공유 메모리에서 읽기
  반납:  채널·공유 공간 해제   (close / msgctl / shmctl)

공유 메모리 동기화 (세마포어)
  P(s)               # 진입 — 임계 구역 잠금
      공유 메모리 접근
  V(s)               # 진출 — 잠금 해제`,
      c: `// 이름 없는 파이프 — 부모가 자식에게 메시지 전달
#include <unistd.h>
#include <sys/wait.h>
#include <stdio.h>

int main() {
    int fd[2], status;               // fd[0] 읽기, fd[1] 쓰기
    char *msg = "Hello IPC";
    char buf[100];

    pipe(fd);                        // ① 파이프 채널 생성
    if (fork() > 0) {                // 부모 — 송신
        close(fd[0]);
        write(fd[1], msg, 10);       // ② 파이프에 쓰기
        wait(&status);
    } else {                         // 자식 — 수신
        close(fd[1]);
        read(fd[0], buf, 10);        // ② 파이프에서 읽기
        printf("%s\\n", buf);
    }
    return 0;
}`,
    },
    useCases: ['셸 파이프라인 (ps -ef | grep)', '클라이언트-서버 프로세스 통신', '생산자-소비자 버퍼 공유', '리눅스 데몬 간 메시지 전달'],
  },

  // ── 교착 상태 ─────────────────────────────────────────────────
  {
    id: 'deadlock', name: '교착 상태', subtitle: 'Deadlock',
    emoji: '⛓️', color: '#ef4444', category: 'process',
    tagline: '서로 상대의 자원을 기다리며 모두 멈춰버린 상태',
    concept: [
      '**교착 상태(Deadlock)**는 둘 이상의 프로세스가 서로 상대가 점유한 자원을 기다리며 영원히 진행하지 못하는 상태입니다.',
      '교착 상태는 **상호 배제·점유 대기·비선점·순환 대기** 4가지 조건이 **모두** 성립할 때만 발생합니다.',
      '대응 전략은 예방(Prevention)·회피(Avoidance)·탐지 후 회복(Detection & Recovery)·무시로 나뉩니다.',
    ],
    keyPoints: [
      '발생 4조건: 상호배제 · 점유대기 · 비선점 · 순환대기',
      '예방 — 4조건 중 하나를 깨뜨림',
      '회피 — 안전 상태 유지 (은행원 알고리즘)',
      '탐지 — 자원 할당 그래프의 사이클 검사',
      '회복 — 프로세스 종료 또는 자원 선점',
    ],
    terminology: [
      { term: '자원 할당 그래프 (RAG)', def: '프로세스·자원과 요청/할당 간선으로 교착을 표현하는 그래프' },
      { term: '상호 배제 (Mutual Exclusion)', def: '자원을 한 번에 한 프로세스만 사용 가능' },
      { term: '점유 대기 (Hold and Wait)', def: '자원을 쥔 채로 다른 자원을 기다림' },
      { term: '비선점 (No Preemption)', def: '다른 프로세스가 쥔 자원을 강제로 빼앗을 수 없음' },
      { term: '순환 대기 (Circular Wait)', def: '프로세스들이 원형으로 서로의 자원을 기다림' },
      { term: '안전 상태 (Safe State)', def: '모든 프로세스가 교착 없이 끝날 수 있는 순서가 존재하는 상태' },
      { term: "은행원 알고리즘 (Banker's)", def: '자원 할당 전 안전 상태가 유지되는지 검사하는 회피 기법' },
    ],
    mechanism: {
      description: '아래 4가지 조건이 동시에 모두 성립할 때만 교착 상태가 발생합니다.',
      steps: [
        { title: '① 상호 배제', desc: '자원을 한 번에 한 프로세스만 사용 — 공유 불가' },
        { title: '② 점유 대기', desc: '자원을 보유한 채로 추가 자원을 기다림' },
        { title: '③ 비선점', desc: '다른 프로세스의 자원을 강제로 빼앗을 수 없음' },
        { title: '④ 순환 대기', desc: 'P1→P2→…→P1 형태로 대기 관계가 원을 이룸' },
      ],
    },
    comparison: {
      title: '교착 상태 처리 전략',
      headers: ['전략', '방법', '특징'],
      rows: [
        ['예방', '4조건 중 하나를 사전에 차단', '자원 이용률 저하'],
        ['회피', '은행원 알고리즘으로 안전 상태 유지', '최대 요구량을 미리 알아야 함'],
        ['탐지·회복', '주기적으로 사이클 검사 후 회복', '탐지·회복 비용 발생'],
        ['무시', '교착을 그냥 둠 (타조 알고리즘)', '대부분의 범용 OS가 채택'],
      ],
    },
    properties: [
      '4가지 조건은 필요조건 — 하나라도 깨지면 교착 상태가 발생하지 않음',
      '자원이 종류당 1개씩일 때, 자원 할당 그래프에 사이클이 있으면 곧 교착 상태',
      '자원이 여러 개면 사이클은 교착의 필요조건일 뿐 (충분조건은 아님)',
      '굶주림(starvation)과 달리, 교착은 관련된 프로세스가 전부 멈춤',
    ],
    code: {
      pseudo: `은행원 알고리즘 — 안전성 검사
  Work ← Available
  Finish[i] ← false   (모든 i)

  반복:
    Finish[i]=false 이고 Need[i] ≤ Work 인 i를 찾음
    없으면 반복 종료
    Work ← Work + Allocation[i]     # i가 끝나고 자원 반납
    Finish[i] ← true

  모든 Finish[i]=true  → 안전 상태
  아니면              → 불안전 상태 (교착 위험)`,
      c: `// 두 스레드가 잠금을 반대 순서로 획득 → 교착 위험
pthread_mutex_t A, B;

void *thread1() {
    pthread_mutex_lock(&A);     // A 획득
    pthread_mutex_lock(&B);     // B 대기… (thread2가 B 보유)
    /* ... 임계 구역 ... */
}
void *thread2() {
    pthread_mutex_lock(&B);     // B 획득
    pthread_mutex_lock(&A);     // A 대기… (thread1이 A 보유) → 교착!
    /* ... 임계 구역 ... */
}
// 해결: 모든 스레드가 같은 순서(A→B)로 잠금을 획득`,
    },
    useCases: ['DB 트랜잭션 락 경합', '멀티스레드 잠금 순서 버그', 'OS 자원 할당 검증', '분산 시스템의 분산 락'],
  },

  // ── 메모리 관리 ───────────────────────────────────────────────
  {
    id: 'memory', name: '메모리 관리', subtitle: 'Memory Management',
    emoji: '🧠', color: '#10b981', category: 'memory',
    tagline: '한정된 물리 메모리를 프로세스들에 효율적으로 나눠주는 기법',
    concept: [
      '**메모리 관리**는 여러 프로세스가 물리 메모리를 공유하도록 공간을 할당·회수·보호하는 OS의 핵심 기능입니다.',
      '초기에는 메모리를 통째로 한 프로세스에 주었지만, 다중 프로그래밍을 위해 **분할 할당**으로 발전했습니다.',
      '연속 할당은 구현이 단순하지만 **단편화(Fragmentation)** 문제가 있어, 이후 페이징·세그먼테이션으로 이어집니다.',
    ],
    keyPoints: [
      '연속 할당 — 프로세스를 메모리에 통째로 적재',
      '동적 분할 배치: First / Best / Worst Fit',
      '외부 단편화 — 빈 공간 합은 충분하나 흩어짐',
      '내부 단편화 — 할당 블록 안에 남는 공간',
      'MMU가 논리 주소 → 물리 주소로 변환',
    ],
    terminology: [
      { term: '논리 주소 (Logical Address)', def: 'CPU가 생성하는 주소 — 가상 주소' },
      { term: '물리 주소 (Physical Address)', def: '실제 메모리(RAM)에서의 주소' },
      { term: 'MMU (Memory Management Unit)', def: '논리 주소를 물리 주소로 변환하는 하드웨어' },
      { term: '외부 단편화', def: '빈 공간 총합은 충분하지만 연속되지 않아 사용하지 못하는 현상' },
      { term: '내부 단편화', def: '할당된 블록 내부에 사용되지 못하고 남는 공간' },
      { term: '압축 (Compaction)', def: '흩어진 빈 공간을 한쪽으로 모아 외부 단편화를 해소' },
      { term: '스와핑 (Swapping)', def: '프로세스를 메모리↔디스크로 통째로 옮기는 작업' },
    ],
    mechanism: {
      description: '새 프로세스를 어느 빈 공간(hole)에 넣을지 결정하는 3가지 동적 분할 전략',
      steps: [
        { title: '최초 적합 (First Fit)', desc: '맨 앞에서부터 검색해 처음 만나는 충분한 공간에 배치 — 빠름' },
        { title: '최적 적합 (Best Fit)', desc: '들어갈 수 있는 가장 작은 공간에 배치 — 작은 조각이 많이 남음' },
        { title: '최악 적합 (Worst Fit)', desc: '가장 큰 공간에 배치 — 남는 공간이 커서 재활용 가능성↑' },
      ],
    },
    classification: [
      { name: '단일 분할', desc: '메모리에 한 프로세스만 적재 — 초기 방식' },
      { name: '고정 분할', desc: '메모리를 미리 일정 크기로 분할 — 내부 단편화 발생' },
      { name: '가변(동적) 분할', desc: '프로세스 크기에 맞춰 분할 — 외부 단편화 발생' },
      { name: '페이징 · 세그먼테이션', desc: '비연속 할당으로 외부 단편화를 해결' },
    ],
    properties: [
      '연속 할당은 외부 단편화에, 고정 분할·페이징은 내부 단편화에 취약',
      'First Fit은 보통 Best Fit만큼 좋은 성능을 내면서 더 빠름',
      '외부 단편화는 압축(compaction)으로 해소할 수 있지만 비용이 큼',
      'MMU의 재배치 레지스터(base) + 한계 레지스터(limit)로 주소 변환과 보호를 수행',
    ],
    code: {
      pseudo: `최초 적합 (First Fit)
  for hole in 빈_공간_목록:          # 메모리 앞쪽부터
      if hole.크기 ≥ 프로세스.크기:
          hole 앞부분에 프로세스 배치
          return 성공
  return 실패                        # 들어갈 공간 없음

최적 적합 (Best Fit)
  best ← null
  for hole in 빈_공간_목록:
      if hole.크기 ≥ 프로세스.크기:
          if best=null or hole.크기 < best.크기:
              best ← hole
  best에 배치`,
      c: `// 재배치 레지스터 + 한계 레지스터로 주소 변환·보호
int translate(int logical, int base, int limit) {
    if (logical < 0 || logical >= limit) {
        printf("주소 위반 — 트랩 발생\\n");   // 메모리 보호
        return -1;
    }
    return base + logical;                   // 물리 주소
}`,
    },
    useCases: ['초기 OS의 메모리 분할', '임베디드 시스템 메모리 배치', 'malloc 힙 할당자', '메모리 풀(memory pool)'],
  },

  // ── 페이징 ────────────────────────────────────────────────────
  {
    id: 'paging', name: '페이징', subtitle: 'Paging',
    emoji: '📄', color: '#f59e0b', category: 'memory',
    tagline: '메모리를 고정 크기 페이지로 나눠 비연속 할당 — 외부 단편화 해결',
    concept: [
      '**페이징(Paging)**은 논리 메모리를 고정 크기의 **페이지(Page)**로, 물리 메모리를 같은 크기의 **프레임(Frame)**으로 나눕니다.',
      '프로세스의 페이지들이 메모리 곳곳의 빈 프레임에 흩어져 들어갈 수 있으므로 **외부 단편화가 사라집니다.**',
      '**페이지 테이블**이 각 페이지가 어느 프레임에 있는지 매핑하며, 주소 변환은 MMU가 수행합니다.',
    ],
    keyPoints: [
      '페이지(논리) ↔ 프레임(물리) — 크기 동일',
      '논리 주소 = 페이지 번호 + 오프셋',
      '페이지 테이블: 페이지 번호 → 프레임 번호',
      '외부 단편화 없음 / 내부 단편화는 마지막 페이지',
      'TLB로 페이지 테이블 접근 속도를 보완',
    ],
    terminology: [
      { term: '페이지 (Page)', def: '논리 주소 공간을 나눈 고정 크기 블록' },
      { term: '프레임 (Frame)', def: '물리 메모리를 나눈, 페이지와 같은 크기의 블록' },
      { term: '페이지 테이블 (PMT)', def: '페이지 번호를 프레임 번호로 변환하는 표 — Page Map Table' },
      { term: '페이지 번호 (Page Number)', def: '논리 주소의 상위 비트 — 페이지 테이블의 인덱스' },
      { term: '오프셋 (Offset)', def: '논리 주소의 하위 비트 — 페이지 내에서의 위치' },
      { term: 'TLB', def: '페이지 테이블의 캐시 — 자주 쓰는 매핑을 빠르게 변환' },
      { term: '내부 단편화', def: '프로세스 크기가 페이지 크기의 배수가 아닐 때 마지막 페이지에 남는 공간' },
    ],
    mechanism: {
      description: 'CPU가 만든 논리 주소를 물리 주소로 변환하는 과정',
      steps: [
        { title: '① 논리 주소 분리', desc: '논리 주소를 페이지 번호(p)와 오프셋(d)으로 나눔' },
        { title: '② 페이지 테이블 조회', desc: '페이지 번호 p로 페이지 테이블을 찾아 프레임 번호(f)를 얻음' },
        { title: '③ 물리 주소 조합', desc: '물리 주소 = 프레임 번호(f) × 페이지 크기 + 오프셋(d)' },
        { title: '④ TLB 활용', desc: '최근 변환은 TLB에 캐시 — TLB 적중 시 페이지 테이블 접근을 생략' },
      ],
    },
    properties: [
      '페이지 크기는 보통 2의 거듭제곱 → 주소를 비트 단위로 깔끔하게 분리',
      '페이지 크기가 2ⁿ이면 오프셋은 하위 n비트, 페이지 번호는 나머지 상위 비트',
      '외부 단편화는 0 — 어떤 빈 프레임에도 페이지를 넣을 수 있음',
      '내부 단편화는 평균적으로 프로세스당 페이지 크기의 절반 정도',
      '페이지 테이블이 커지면 메모리를 많이 차지 → 다단계 페이지 테이블을 사용',
    ],
    code: {
      pseudo: `페이징 주소 변환
  페이지 크기 = 2ⁿ
  페이지 번호 p = 논리주소 / 페이지크기      (상위 비트)
  오프셋     d = 논리주소 % 페이지크기      (하위 n비트)

  프레임 번호 f = 페이지테이블[p]
  물리 주소 = f × 페이지크기 + d`,
      c: `// 논리 주소 → 물리 주소 (페이지 크기 = 2^OFFSET_BITS)
#define OFFSET_BITS 12                       // 페이지 크기 4KB

int translate(int logical, int page_table[]) {
    int page   = logical >> OFFSET_BITS;             // 페이지 번호
    int offset = logical & ((1 << OFFSET_BITS) - 1); // 오프셋

    int frame = page_table[page];                    // 프레임 번호
    return (frame << OFFSET_BITS) | offset;          // 물리 주소
}`,
    },
    useCases: ['현대 OS의 표준 메모리 관리', '가상 메모리의 기반', 'CPU의 MMU 하드웨어', 'mmap 메모리 매핑'],
  },

  // ── 세그먼테이션 ──────────────────────────────────────────────
  {
    id: 'segmentation', name: '세그먼테이션', subtitle: 'Segmentation',
    emoji: '🗂️', color: '#f97316', category: 'memory',
    tagline: '메모리를 의미 단위(코드·데이터·스택)로 나누는 가변 크기 기법',
    concept: [
      '**세그먼테이션(Segmentation)**은 프로그램을 코드·데이터·스택처럼 **논리적 의미 단위(세그먼트)**로 나눕니다.',
      '각 세그먼트는 **크기가 제각각**이며, 논리 주소는 **(세그먼트 번호, 오프셋)** 쌍으로 표현됩니다.',
      '**세그먼트 테이블**이 각 세그먼트의 시작 주소(base)와 길이(limit)를 저장하고, 오프셋이 limit을 넘으면 보호 위반입니다.',
    ],
    keyPoints: [
      '세그먼트 = 의미 단위 (코드 / 데이터 / 스택)',
      '세그먼트마다 크기가 다름 — 가변 길이',
      '논리 주소 = (세그먼트 번호, 오프셋)',
      '세그먼트 테이블: 번호 → (base, limit)',
      'offset ≥ limit → 메모리 보호 위반(트랩)',
    ],
    terminology: [
      { term: '세그먼트 (Segment)', def: '코드·데이터·스택 등 논리적으로 묶인 가변 크기 영역' },
      { term: '세그먼트 번호', def: '논리 주소에서 어떤 세그먼트를 가리키는지 지정' },
      { term: 'base (기준 주소)', def: '세그먼트가 물리 메모리에서 시작하는 주소' },
      { term: 'limit (한계)', def: '세그먼트의 길이 — 유효한 오프셋의 상한' },
      { term: '세그먼트 테이블 (SMT)', def: '세그먼트 번호 → (base, limit)를 매핑하는 표 — Segment Map Table' },
      { term: '보호 위반 (Protection Fault)', def: '오프셋이 limit을 초과해 발생하는 트랩' },
    ],
    mechanism: {
      description: '(세그먼트 번호, 오프셋) 형태의 논리 주소를 물리 주소로 변환',
      steps: [
        { title: '① 논리 주소 분리', desc: '논리 주소를 세그먼트 번호(s)와 오프셋(d)으로 분리' },
        { title: '② 세그먼트 테이블 조회', desc: '세그먼트 번호 s로 (base, limit)를 얻음' },
        { title: '③ 한계 검사', desc: 'd ≥ limit이면 보호 위반 트랩 발생 — 변환 중단' },
        { title: '④ 물리 주소 계산', desc: 'd < limit이면 물리 주소 = base + d' },
      ],
    },
    comparison: {
      title: '페이징 vs 세그먼테이션',
      headers: ['구분', '페이징', '세그먼테이션'],
      rows: [
        ['분할 단위', '고정 크기 페이지', '가변 크기 의미 단위'],
        ['논리 주소', '페이지 번호 + 오프셋', '세그먼트 번호 + 오프셋'],
        ['단편화', '내부 단편화', '외부 단편화'],
        ['크기 정보', '불필요 (모두 동일)', 'limit으로 한계 검사'],
        ['관점', '물리적 — 메모리 효율', '논리적 — 프로그래머 관점'],
      ],
    },
    properties: [
      '세그먼트는 크기가 제각각이라 외부 단편화가 발생 (페이징과 반대)',
      '같은 세그먼트에 보호 비트·공유 설정을 통째로 적용하기 쉬움 — 코드 공유에 유리',
      'base + limit 한 쌍만으로 메모리 보호가 자연스럽게 이뤄짐',
      '현대 시스템은 세그먼테이션과 페이징을 결합 (세그먼트를 다시 페이징)',
    ],
    code: {
      pseudo: `세그먼테이션 주소 변환
  논리 주소 = (세그먼트 번호 s, 오프셋 d)

  (base, limit) ← 세그먼트테이블[s]
  if d ≥ limit:
      보호 위반 트랩            # 세그먼트 경계 초과
  else:
      물리 주소 = base + d`,
      c: `typedef struct { int base, limit; } Segment;

int translate(Segment table[], int seg, int offset) {
    if (offset < 0 || offset >= table[seg].limit) {
        printf("세그먼트 %d 경계 위반 — 트랩\\n", seg);
        return -1;                          // 보호 위반
    }
    return table[seg].base + offset;        // 물리 주소
}`,
    },
    useCases: ['x86의 세그먼트 레지스터(CS/DS/SS)', '코드·데이터·스택 영역 분리', '공유 라이브러리 세그먼트', '컴파일러의 모듈 단위 적재'],
  },

  // ── 가상 메모리 ───────────────────────────────────────────────
  {
    id: 'virtualmemory', name: '가상 메모리', subtitle: 'Virtual Memory',
    emoji: '🪟', color: '#14b8a6', category: 'memory',
    tagline: '실제 메모리보다 큰 주소 공간을 디스크로 확장하는 기법',
    concept: [
      '**가상 메모리**는 프로세스 전체를 메모리에 올리지 않고 **당장 필요한 부분만** 적재해, 물리 메모리보다 큰 프로그램을 실행하게 합니다.',
      '**요구 페이징(Demand Paging)**은 페이지가 실제로 참조될 때 비로소 디스크에서 메모리로 가져옵니다.',
      '참조한 페이지가 메모리에 없으면 **페이지 폴트(Page Fault)**가 발생하고, OS가 디스크에서 해당 페이지를 적재합니다.',
    ],
    keyPoints: [
      '필요한 페이지만 적재 → 큰 프로그램 실행',
      '요구 페이징 — 참조 시점에 적재',
      '유효 비트(valid bit)로 메모리 적재 여부 표시',
      '페이지 폴트 → 디스크에서 페이지 로드',
      '지역성(locality) 덕분에 폴트율이 낮게 유지됨',
    ],
    terminology: [
      { term: '가상 주소 공간', def: '프로세스가 보는 논리적 주소 공간 — 물리 메모리보다 클 수 있음' },
      { term: '요구 페이징 (Demand Paging)', def: '페이지를 참조하는 순간에만 메모리로 적재' },
      { term: '페이지 폴트 (Page Fault)', def: '참조한 페이지가 메모리에 없어 발생하는 트랩' },
      { term: '유효 비트 (Valid Bit)', def: '페이지가 메모리에 있는지(valid) 디스크에 있는지(invalid)를 표시' },
      { term: '스왑 영역 (Swap Space)', def: '디스크에서 페이지를 보관하는 전용 공간' },
      { term: '지역성 (Locality)', def: '최근 참조한 영역 근처를 다시 참조하는 경향 — 시간·공간 지역성' },
      { term: '스래싱 (Thrashing)', def: '페이지 폴트가 과도해 CPU가 페이지 교체에만 매달리는 상태' },
    ],
    mechanism: {
      description: '참조한 페이지가 메모리에 없을 때 OS가 처리하는 과정',
      steps: [
        { title: '① 페이지 참조', desc: 'CPU가 주소를 참조 — 페이지 테이블의 유효 비트를 확인' },
        { title: '② 폴트 발생', desc: '유효 비트가 invalid면 페이지 폴트 트랩 → OS로 제어가 넘어감' },
        { title: '③ 디스크에서 적재', desc: '스왑 영역에서 해당 페이지를 찾아 빈 프레임으로 읽어옴' },
        { title: '④ 페이지 테이블 갱신', desc: '프레임 번호를 기록하고 유효 비트를 valid로 변경' },
        { title: '⑤ 명령어 재실행', desc: '중단됐던 명령어를 다시 실행 — 이제는 적중' },
      ],
    },
    properties: [
      '가상 메모리 덕에 물리 메모리보다 큰 프로그램, 더 많은 프로세스의 동시 실행이 가능',
      '페이지 폴트는 디스크 접근을 동반해 매우 느림 (메모리 접근의 수만 배)',
      '유효 접근 시간 ≈ (1−p)×메모리시간 + p×페이지폴트시간 — p는 폴트율',
      '다중 프로그래밍 정도가 너무 높으면 스래싱 발생 → 워킹 셋 모델로 완화',
    ],
    code: {
      pseudo: `요구 페이징 — 메모리 접근
  참조(페이지 p):
      if 페이지테이블[p].valid:
          물리 메모리 접근                  # 적중 (hit)
      else:
          페이지 폴트!
          ① 빈 프레임 확보 (없으면 페이지 교체)
          ② 디스크 스왑 영역 → 프레임으로 p 적재
          ③ 페이지테이블[p]: frame 기록, valid ← true
          ④ 중단된 명령어를 재실행

유효 접근 시간 (EAT)
  EAT = (1 − p) × 메모리접근시간 + p × 페이지폴트처리시간`,
      c: `// 요구 페이징 — 페이지 접근 시뮬레이션
int access_page(int p, PageTableEntry pt[]) {
    if (pt[p].valid)
        return pt[p].frame;          // 적중 — 바로 접근

    page_fault_count++;              // 페이지 폴트!
    int frame = get_free_frame();    // 빈 프레임 확보
    load_from_disk(p, frame);        // 디스크 → 메모리
    pt[p].frame = frame;
    pt[p].valid = 1;                 // 유효 비트 갱신
    return frame;
}`,
    },
    useCases: ['모든 현대 OS의 메모리 모델', 'mmap 파일 매핑', '메모리 초과 할당(overcommit)', '프로세스 간 메모리 격리'],
  },

  // ── 페이지 교체 ───────────────────────────────────────────────
  {
    id: 'pagereplace', name: '페이지 교체', subtitle: 'Page Replacement',
    emoji: '🔄', color: '#ec4899', category: 'memory',
    tagline: '메모리가 꽉 찼을 때 어떤 페이지를 내보낼지 결정하는 알고리즘',
    concept: [
      '페이지 폴트가 났는데 **빈 프레임이 없으면**, 기존 페이지 하나를 디스크로 내보내고 새 페이지를 들여와야 합니다.',
      '**페이지 교체 알고리즘**은 내보낼 **희생 페이지(victim)**를 선택하는 정책입니다.',
      '좋은 알고리즘은 페이지 폴트 수를 최소화합니다 — FIFO·LRU·Optimal·LFU 등이 있습니다.',
    ],
    keyPoints: [
      'FIFO — 가장 먼저 들어온 페이지 교체',
      'LRU — 가장 오래 참조 안 된 페이지 교체',
      'Optimal — 앞으로 가장 늦게 쓸 페이지 교체 (이론적 최적)',
      "Belady의 모순 — FIFO는 프레임을 늘려도 폴트가 늘 수 있음",
      '목표: 페이지 폴트 횟수 최소화',
    ],
    terminology: [
      { term: '희생 페이지 (Victim)', def: '교체를 위해 메모리에서 내보낼 페이지' },
      { term: '참조열 (Reference String)', def: '프로세스가 참조하는 페이지 번호의 순서열' },
      { term: 'FIFO', def: '가장 먼저 적재된 페이지를 먼저 교체' },
      { term: 'LRU (Least Recently Used)', def: '가장 오랫동안 참조되지 않은 페이지를 교체' },
      { term: 'Optimal (OPT)', def: '앞으로 가장 오래 사용되지 않을 페이지를 교체 — 실현 불가능한 이론적 기준' },
      { term: "Belady의 모순", def: '프레임 수를 늘렸는데 오히려 페이지 폴트가 증가하는 현상' },
    ],
    comparison: {
      title: '페이지 교체 알고리즘',
      headers: ['알고리즘', '교체 대상', '특징'],
      rows: [
        ['FIFO', '가장 먼저 들어온 페이지', '구현 단순 / Belady 모순 발생'],
        ['LRU', '가장 오래 참조 안 된 페이지', '성능 우수 / 구현 비용 큼'],
        ['Optimal', '앞으로 가장 늦게 쓸 페이지', '최소 폴트 / 미래를 알아야 해 실현 불가'],
        ['LFU', '참조 횟수가 가장 적은 페이지', '빈도 기반 / 과거 인기에 집착'],
        ['Clock', '참조 비트가 0인 페이지', 'LRU 근사 — 2차 기회, 실용적'],
      ],
    },
    properties: [
      'Optimal은 폴트가 최소지만 미래 참조를 알아야 해 실제로는 쓸 수 없음 — 다른 알고리즘의 성능 기준',
      'LRU는 Optimal에 가깝지만, 참조 시각을 모두 기록해야 해 오버헤드가 큼',
      'FIFO는 Belady의 모순이 있어 프레임 증가가 항상 이득은 아님',
      'LRU와 Optimal은 스택 알고리즘이라 Belady의 모순이 없음',
    ],
    code: {
      pseudo: `FIFO 페이지 교체
  for page in 참조열:
      if page in 프레임:        continue        # 적중
      if 프레임에 빈자리 있음:   프레임에 page 추가
      else:                     가장 오래된 페이지 제거 후 page 추가
      페이지 폴트 += 1

LRU 페이지 교체
  for page in 참조열:
      if page in 프레임:
          page를 '최근 사용'으로 갱신             # 적중
      else:
          if 프레임이 꽉 참:
              가장 오래 참조 안 된 페이지 제거
          프레임에 page 추가
          페이지 폴트 += 1`,
      c: `// FIFO 페이지 교체 — 페이지 폴트 수 계산
int fifo(int ref[], int n, int frames) {
    int slot[16], count = 0, faults = 0, next = 0;
    for (int i = 0; i < n; i++) {
        int hit = 0;
        for (int j = 0; j < count; j++)
            if (slot[j] == ref[i]) hit = 1;
        if (hit) continue;                  // 적중
        if (count < frames) slot[count++] = ref[i];
        else { slot[next] = ref[i];         // 가장 오래된 것 교체
               next = (next + 1) % frames; }
        faults++;
    }
    return faults;
}`,
    },
    useCases: ['OS 가상 메모리 관리자', 'CPU·DB 버퍼 캐시', '웹 브라우저 캐시', 'CDN 콘텐츠 캐시'],
  },

  // ── 파일 시스템 ───────────────────────────────────────────────
  {
    id: 'filesystem', name: '파일 시스템', subtitle: 'File System',
    emoji: '📁', color: '#0ea5e9', category: 'storage',
    tagline: '디스크의 데이터를 파일·디렉터리로 조직하고 관리하는 체계',
    concept: [
      '**파일 시스템**은 디스크라는 블록 장치 위에 **파일과 디렉터리**라는 추상을 제공해, 데이터를 이름으로 다루게 합니다.',
      '파일의 데이터 블록을 디스크에 배치하는 방식에는 **연속·연결·색인 할당**이 있습니다.',
      '디렉터리는 파일 이름을 메타데이터(inode 등)와 연결하며, 트리 구조로 계층을 이룹니다.',
    ],
    keyPoints: [
      '파일 — 이름이 붙은 논리적 데이터 단위',
      '디렉터리 — 파일을 계층적으로 묶는 구조',
      '할당 방식: 연속 · 연결 · 색인',
      'inode — 파일 메타데이터 + 블록 위치',
      '빈 공간 관리: 비트맵 · 자유 리스트',
    ],
    terminology: [
      { term: '파일 (File)', def: '이름으로 식별되는, 관련 데이터의 모음' },
      { term: '디렉터리 (Directory)', def: '파일과 하위 디렉터리를 담는 목록 — 폴더' },
      { term: 'inode', def: '파일의 메타데이터(크기·권한·시간)와 데이터 블록 위치를 담는 구조' },
      { term: '블록 (Block)', def: '파일 시스템이 디스크를 다루는 최소 입출력 단위' },
      { term: '마운트 (Mount)', def: '파일 시스템을 디렉터리 트리의 한 지점에 연결' },
      { term: '메타데이터 (Metadata)', def: '파일 내용이 아닌, 파일에 대한 정보 (크기·소유자·시각 등)' },
    ],
    mechanism: {
      description: '파일의 데이터 블록을 디스크에 배치하는 3가지 할당 방식',
      steps: [
        { title: '연속 할당', desc: '파일을 연속된 블록에 배치. 순차·직접 접근이 빠름 / 외부 단편화, 크기 확장 어려움' },
        { title: '연결 할당', desc: '각 블록이 다음 블록을 가리킴. 단편화 없음 / 직접 접근 불가, 포인터 손상에 취약' },
        { title: '색인 할당', desc: '색인 블록에 모든 데이터 블록 주소를 모음. 직접 접근 가능 / 색인 블록 오버헤드' },
      ],
    },
    comparison: {
      title: '파일 할당 방식 비교',
      headers: ['방식', '직접 접근', '단편화', '단점'],
      rows: [
        ['연속', '가능 (빠름)', '외부 단편화', '파일 확장이 어려움'],
        ['연결', '불가 (순차만)', '없음', '포인터 1개 손상 시 이후 데이터 유실'],
        ['색인', '가능', '없음', '작은 파일에도 색인 블록이 필요'],
      ],
    },
    properties: [
      '연속 할당은 직접 접근이 빠르지만 파일 크기 증가와 외부 단편화에 약함',
      '연결 할당은 직접 접근이 불가능 — k번째 블록을 읽으려면 k번 따라가야 함',
      '색인 할당은 큰 파일을 위해 다단계 색인(간접 블록)을 사용 (Unix inode)',
      '빈 블록 관리는 비트맵(공간 효율적) 또는 자유 리스트로 수행',
    ],
    code: {
      pseudo: `연결 할당 — k번째 블록 읽기
  block ← 파일.시작블록
  for i in 0 .. k-1:
      block ← block.next        # 포인터를 따라 이동 → 직접 접근 불가
  return block.데이터

색인 할당 — k번째 블록 읽기
  index_block ← 파일.색인블록
  block_addr  ← index_block[k]  # 색인에서 바로 조회 → 직접 접근 O(1)
  return 디스크[block_addr]`,
      c: `// Unix inode 구조 (단순화)
#define N_DIRECT 12
typedef struct {
    int size;                    // 파일 크기
    int mode;                    // 권한
    int direct[N_DIRECT];        // 직접 블록 포인터 12개
    int single_indirect;         // 단일 간접 블록
    int double_indirect;         // 이중 간접 블록
} inode;`,
    },
    useCases: ['ext4 · NTFS · APFS', 'USB·SSD 저장 관리', '데이터베이스 파일 저장', '로그·백업 관리'],
  },

  // ── 디스크 스케줄링 ───────────────────────────────────────────
  {
    id: 'diskscheduling', name: '디스크 스케줄링', subtitle: 'Disk Scheduling',
    emoji: '💽', color: '#a855f7', category: 'storage',
    tagline: '디스크 입출력 요청 순서를 정해 헤드 이동(탐색 시간)을 줄이는 기법',
    concept: [
      '하드 디스크는 헤드가 원하는 트랙(실린더)으로 이동하는 **탐색 시간(seek time)**이 성능의 핵심입니다.',
      '**디스크 스케줄링**은 대기 중인 입출력 요청들을 처리할 순서를 정해 **헤드의 총 이동 거리를 줄입니다.**',
      'FCFS·SSTF·SCAN·C-SCAN·LOOK 등이 있으며, 각각 효율과 공정성이 다릅니다.',
    ],
    keyPoints: [
      'FCFS — 요청 도착 순서대로 (공정하나 비효율)',
      'SSTF — 현재 헤드에서 가장 가까운 요청 (기아 가능)',
      'SCAN — 한 방향 끝까지 갔다 되돌아옴 (엘리베이터)',
      'C-SCAN — 끝에 도달하면 처음으로 점프 (대기 균등)',
      '평가 기준: 헤드의 총 이동 거리',
    ],
    terminology: [
      { term: '탐색 시간 (Seek Time)', def: '헤드를 목표 트랙으로 이동하는 데 걸리는 시간' },
      { term: '회전 지연 (Rotational Latency)', def: '원하는 섹터가 헤드 밑으로 회전해 올 때까지의 시간' },
      { term: '실린더 (Cylinder)', def: '여러 플래터의 같은 트랙 묶음 — 헤드 이동의 단위' },
      { term: '헤드 (Head)', def: '디스크 표면을 읽고 쓰는 장치 — 트랙 사이를 이동' },
      { term: '디스크 대기 큐', def: '아직 처리되지 않은 입출력 요청들의 목록' },
      { term: '기아 (Starvation)', def: '멀리 있는 요청이 계속 뒤로 밀려 처리되지 못하는 현상' },
    ],
    comparison: {
      title: '디스크 스케줄링 알고리즘',
      headers: ['알고리즘', '동작', '특징'],
      rows: [
        ['FCFS', '도착 순서대로 처리', '공정 / 이동 거리 큼'],
        ['SSTF', '가장 가까운 요청 먼저', '효율적 / 먼 요청 기아'],
        ['SCAN', '한 방향 끝까지 → 반대 방향', '엘리베이터 방식 / 양 끝이 불리'],
        ['C-SCAN', '끝 도달 시 처음으로 복귀', '대기 시간이 균등'],
        ['LOOK', 'SCAN이되 마지막 요청에서 방향 전환', '끝까지 안 감 — 효율↑'],
      ],
    },
    properties: [
      'FCFS는 공정하지만 헤드가 멀리 왔다 갔다 해 총 이동 거리가 큼',
      'SSTF는 가까운 요청만 처리해 가장자리 요청이 기아에 빠질 수 있음',
      'SCAN·C-SCAN은 헤드를 한 방향으로만 움직여 기아를 방지',
      'C-SCAN은 복귀할 때 요청을 처리하지 않아 트랙 전체의 대기 시간이 더 균등',
      'SSD는 탐색 시간이 없어 디스크 스케줄링의 의미가 크게 줄어듦',
    ],
    code: {
      pseudo: `SSTF — 가장 가까운 요청 먼저
  현재 ← 헤드 시작 위치
  while 대기 큐가 비어있지 않음:
      next ← 큐에서 |요청 − 현재|가 최소인 요청
      이동 거리 += |next − 현재|
      현재 ← next;  큐에서 next 제거

SCAN — 한 방향으로 끝까지 (엘리베이터)
  방향 ← 위쪽
  while 처리할 요청 남음:
      방향에 있는 가장 가까운 요청 처리
      디스크 끝에 도달하면 방향 반전`,
      c: `// FCFS — 헤드 총 이동 거리 계산
#include <stdlib.h>

int fcfs_distance(int head, int req[], int n) {
    int total = 0, cur = head;
    for (int i = 0; i < n; i++) {
        total += abs(req[i] - cur);   // 절대 이동 거리 누적
        cur = req[i];
    }
    return total;
}`,
    },
    useCases: ['HDD 입출력 스케줄러', 'OS 블록 장치 I/O 큐', '데이터베이스 디스크 접근 최적화', 'RAID 컨트롤러'],
  },
]
