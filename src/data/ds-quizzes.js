export const QUIZZES = {
  pointer: [
    { q: '포인터 변수가 저장하는 값은?', options: ['실제 데이터 값','메모리 주소','배열 인덱스','자료형 크기'], answer: 1, explanation: '포인터는 다른 변수가 저장된 메모리 주소를 값으로 갖습니다. *ptr로 역참조해야 실제 값을 얻습니다.' },
    { q: '64비트 시스템에서 포인터의 크기는?', options: ['4바이트','8바이트','자료형에 따라 다름','2바이트'], answer: 1, explanation: '64비트 시스템의 메모리 주소는 64비트(8바이트)입니다. int*, double*, char* 모두 8바이트.' },
    { q: 'NULL 포인터를 역참조하면?', options: ['0을 반환','빈 문자열 반환','런타임 오류(Segfault)','무시됨'], answer: 2, explanation: 'NULL(0번지)은 유효하지 않은 주소이므로 역참조하면 Segmentation Fault(C) 또는 NullPointerException(Java)이 발생합니다.' },
    { q: '댕글링 포인터(Dangling Pointer)란?', options: ['NULL로 초기화된 포인터','해제된 메모리를 가리키는 포인터','배열 끝을 가리키는 포인터','함수 반환값 포인터'], answer: 1, explanation: 'free()/delete 이후에도 같은 주소를 계속 가리키는 포인터. 접근하면 정의되지 않은 동작(UB).' },
    { q: 'Python에서 a = [1,2,3]; b = a 를 실행한 후 b.append(4)를 하면?', options: ['a는 변경 없음','a = [1,2,3,4]','오류 발생','b만 [1,2,3,4]'], answer: 1, explanation: 'Python에서 b = a는 같은 리스트 객체를 참조(포인터)하므로 b를 통한 변경이 a에도 반영됩니다.' },
  ],
  list: [
    { q: '리스트 ADT에서 get(i)의 배열 기반 시간 복잡도는?', options: ['O(1)','O(log n)','O(n)','O(n²)'], answer: 0, explanation: '배열 기반 리스트는 인덱스로 주소를 직접 계산하므로 O(1) 접근이 가능합니다.' },
    { q: '배열 기반 리스트의 동적 확장 시 amortized append 복잡도는?', options: ['O(n)','O(log n)','O(1)','O(n²)'], answer: 2, explanation: '용량 초과 시 2배 확장은 드물게 발생. 전체 복사 비용 n+n/2+n/4+…=2n → 원소당 평균 O(1).' },
    { q: '연결 리스트 기반 리스트의 임의 위치 삽입 시간 복잡도는?', options: ['O(1)','O(log n)','O(n)','O(1) amortized'], answer: 2, explanation: '삽입 자체는 O(1)이지만 삽입 위치까지 순회하는 데 O(n)이 걸립니다.' },
    { q: 'Java의 ArrayList와 LinkedList 중 빈번한 중간 삽입·삭제에 유리한 것은?', options: ['ArrayList','LinkedList','둘 다 동일','상황에 따라 다름'], answer: 1, explanation: 'LinkedList는 포인터 교체만으로 삽입·삭제가 가능해 O(1). ArrayList는 원소 이동으로 O(n).' },
    { q: '리스트에서 인덱스 범위를 벗어난 접근 시 발생하는 예외는?', options: ['NullPointerException','IndexError/IndexOutOfBoundsException','MemoryError','OverflowError'], answer: 1, explanation: 'Python은 IndexError, Java는 IndexOutOfBoundsException, JavaScript는 undefined 반환.' },
  ],
  array: [
    { q: '배열에서 인덱스로 요소에 접근하는 시간 복잡도는?', options: ['O(1)','O(log n)','O(n)','O(n²)'], answer: 0, explanation: '배열은 연속된 메모리에 저장되므로 시작 주소 + 인덱스 × 자료형 크기로 O(1) 접근.' },
    { q: '크기 n인 배열의 중간에 요소를 삽입할 때 시간 복잡도는?', options: ['O(1)','O(log n)','O(n)','O(n log n)'], answer: 2, explanation: '삽입 위치 이후의 모든 요소를 한 칸씩 뒤로 밀어야 하므로 최대 n번 이동.' },
    { q: '2차원 배열 arr[i][j]의 메모리 주소 계산식은? (행 우선, base=B, 열 수=C, 자료형 크기=S)', options: ['B + j×S','B + i×S','B + (i×C + j)×S','B + (j×C + i)×S'], answer: 2, explanation: '행 우선 순서(C언어): 행 오프셋 = i×C개, 열 오프셋 = j개 → 총 i×C+j 번째 원소.' },
    { q: '정렬된 배열에서 이진 탐색의 시간 복잡도는?', options: ['O(1)','O(log n)','O(n)','O(n log n)'], answer: 1, explanation: '이진 탐색은 매 단계마다 범위를 절반으로 줄이므로 O(log n).' },
    { q: '배열의 맨 끝에 요소를 추가(append)하는 시간 복잡도는?', options: ['O(1)','O(log n)','O(n)','O(n²)'], answer: 0, explanation: '끝 위치는 크기로 바로 알고, 다른 원소를 이동시킬 필요가 없으므로 O(1).' },
  ],
  stack: [
    { q: '스택의 원칙은?', options: ['FIFO','LIFO','우선순위 순','랜덤'], answer: 1, explanation: 'LIFO — 마지막에 push한 원소가 가장 먼저 pop됩니다.' },
    { q: 'push 연산의 시간 복잡도는?', options: ['O(1)','O(log n)','O(n)','O(n²)'], answer: 0, explanation: '항상 꼭대기(top)에만 추가하므로 다른 원소 이동 없이 O(1).' },
    { q: '스택을 사용하지 않는 알고리즘은?', options: ['함수 재귀 호출','괄호 유효성 검사','너비 우선 탐색(BFS)','DFS 반복 구현'], answer: 2, explanation: 'BFS는 큐를 사용합니다. DFS는 스택(또는 재귀 콜스택)을 사용합니다.' },
    { q: '빈 스택에서 pop을 시도하면?', options: ['null 반환','0 반환','Stack Underflow','Stack Overflow'], answer: 2, explanation: '빈 스택에서 pop 시도 = Stack Underflow. Stack Overflow는 스택이 꽉 찼을 때.' },
    { q: '스택 두 개로 큐를 구현할 때 dequeue의 amortized 시간 복잡도는?', options: ['O(1)','O(n)','O(log n)','O(n²)'], answer: 0, explanation: '스택1→스택2로 옮기는 비용이 n번의 enqueue에 걸쳐 분산 → amortized O(1).' },
  ],
  queue: [
    { q: '큐의 원칙은?', options: ['LIFO','FIFO','우선순위 순','랜덤'], answer: 1, explanation: 'FIFO — 먼저 enqueue한 원소가 먼저 dequeue됩니다.' },
    { q: '큐에서 삽입이 일어나는 위치는?', options: ['front(앞)','rear(뒤)','중간','어디든'], answer: 1, explanation: '큐는 rear(뒤)에서 enqueue, front(앞)에서 dequeue.' },
    { q: 'BFS에서 큐를 사용하는 이유는?', options: ['LIFO이므로 깊이 우선','FIFO로 레벨 단위 탐색','공간 효율','재귀 구현 용이'], answer: 1, explanation: 'FIFO 순서로 현재 레벨의 모든 노드를 방문 후 다음 레벨로 이동 = 너비 우선.' },
    { q: '원형 큐에서 포화 조건은? (cap=배열 크기)', options: ['front == rear','rear == cap-1','(rear+1)%cap == front','front == 0'], answer: 2, explanation: '원형 큐: 공백=(front==rear), 포화=(rear+1)%cap==front. 슬롯 하나를 낭비해 구분.' },
    { q: 'dequeue 연산의 시간 복잡도는? (올바른 구현 기준)', options: ['O(1)','O(log n)','O(n)','O(n²)'], answer: 0, explanation: 'front 포인터를 한 칸 이동하는 것만으로 완료 → O(1).' },
  ],
  linkedlist: [
    { q: '연결 리스트에서 k번째 요소 접근 시간 복잡도는?', options: ['O(1)','O(log n)','O(n)','O(k)'], answer: 2, explanation: '인덱스가 없어 head부터 k번 next를 따라가야 하므로 O(n).' },
    { q: '단방향 연결 리스트의 각 노드가 가지는 것은?', options: ['데이터만','데이터+인덱스','데이터+next 포인터','데이터+prev+next'], answer: 2, explanation: '단방향은 data와 next 포인터. 이전+다음 양쪽은 양방향(doubly) 연결 리스트.' },
    { q: '헤드 앞에 새 노드 삽입 시 시간 복잡도는?', options: ['O(1)','O(log n)','O(n)','O(n²)'], answer: 0, explanation: '새 노드의 next = 현재 head, head = 새 노드 — 포인터 교체만으로 O(1).' },
    { q: 'LRU 캐시 구현에 적합한 자료구조 조합은?', options: ['배열+스택','양방향 연결 리스트+해시 테이블','스택+큐','배열+이진 탐색'], answer: 1, explanation: '양방향 연결 리스트로 접근 순서 O(1) 업데이트, 해시 테이블로 O(1) 탐색.' },
    { q: '배열 대비 연결 리스트의 단점은?', options: ['삽입·삭제 느림','랜덤 접근 불가','크기 변경 불가','캐시 효율 좋음'], answer: 1, explanation: '연결 리스트는 포인터를 따라가야 하므로 k번째 원소 접근이 O(n). 또한 포인터가 메모리를 추가 사용하고 캐시 지역성이 나쁩니다.' },
  ],
  circular: [
    { q: '순환 연결 리스트에서 꼬리 노드의 next가 가리키는 것은?', options: ['NULL','헤드 노드','꼬리 자신','중간 노드'], answer: 1, explanation: '순환 연결 리스트: tail.next = head. 리스트에 끝이 없음.' },
    { q: 'Floyd 사이클 감지 알고리즘에서 사용하는 포인터는?', options: ['단일 포인터','3개 포인터','느린(1칸)·빠른(2칸) 2개 포인터','N개 포인터'], answer: 2, explanation: '토끼와 거북이: slow는 1칸, fast는 2칸. 사이클이 있으면 둘이 반드시 만남.' },
    { q: 'Floyd 알고리즘의 시간 복잡도는?', options: ['O(1)','O(log n)','O(n)','O(n²)'], answer: 2, explanation: 'slow와 fast가 사이클 내에서 만날 때까지 최대 n번 이동 → O(n).' },
    { q: '원형 큐에서 공백 조건은?', options: ['rear == 0','front == cap-1','front == rear','(rear+1)%cap == front'], answer: 2, explanation: 'front == rear이면 비어있음. 포화는 (rear+1)%cap == front.' },
    { q: '순환 리스트가 일반 연결 리스트보다 유리한 응용은?', options: ['이진 탐색','라운드 로빈 스케줄러','정렬','해시 충돌 처리'], answer: 1, explanation: '라운드 로빈은 순서대로 돌아가며 실행 — 꼬리 다음이 헤드인 순환 구조가 자연스럽게 맞음.' },
  ],
  tree: [
    { q: 'n개 노드를 가진 트리의 간선 수는?', options: ['n','n-1','n+1','n/2'], answer: 1, explanation: '트리는 사이클이 없는 연결 그래프 → 정확히 n-1개의 간선.' },
    { q: '트리에서 자식이 없는 노드를 무엇이라 하는가?', options: ['루트','내부 노드','리프(단말 노드)','서브트리'], answer: 2, explanation: '리프(Leaf) = 단말 노드. 자식이 하나도 없는 노드.' },
    { q: '이진 트리를 중위 순회(왼→루트→오)하면 어떤 결과인가? (BST 기준)', options: ['삽입 순서','내림차순 정렬','오름차순 정렬','레벨 순서'], answer: 2, explanation: 'BST의 중위 순회는 왼(작음)→루트→오(큼) 순서로 오름차순 정렬된 결과.' },
    { q: '높이 h인 이진 트리의 최대 노드 수는? (높이 = 트리의 최대 레벨)', options: ['h','2h','2^h - 1','2^(h+1)'], answer: 2, explanation: '높이 h = 레벨 수. 레벨 1에 1개, 레벨 2에 2개, …, 레벨 h에 2^(h-1)개 → 합 = 2^0+…+2^(h-1) = 2^h - 1. (예: 높이 3 → 7개)' },
    { q: '완전 이진 트리를 배열로 표현할 때 인덱스 i 노드의 왼쪽 자식은? (1-based)', options: ['i-1','i+1','2i','2i+1'], answer: 2, explanation: '1-based 배열 힙: 왼쪽 자식=2i, 오른쪽=2i+1, 부모=i//2.' },
  ],
  bst: [
    { q: 'BST에서 왼쪽 자식 노드의 값 조건은?', options: ['부모보다 크다','부모보다 작다','부모와 같다','제한 없다'], answer: 1, explanation: 'BST 규칙: 왼쪽 서브트리의 모든 값 < 현재 노드 < 오른쪽 서브트리의 모든 값.' },
    { q: '균형 잡힌 BST에서 탐색 시간 복잡도는?', options: ['O(1)','O(log n)','O(n)','O(n log n)'], answer: 1, explanation: '균형 BST: 탐색마다 범위가 절반으로 줄어 O(log n). 트리 높이 = O(log n).' },
    { q: 'BST 최악 시간 복잡도가 O(n)이 되는 경우는?', options: ['완전 이진 트리','루트만 있을 때','한쪽으로 치우친 편향 트리','노드 수가 짝수'], answer: 2, explanation: '1, 2, 3, 4, 5 순서 삽입 → 오른쪽으로만 이어지는 편향 트리 → 연결 리스트와 동일하게 O(n).' },
    { q: 'AVL 트리가 BST와 다른 점은?', options: ['삽입 순서 기억','균형 인수 ±1 이상이면 회전으로 재균형','음수 키 허용','중복 키 허용'], answer: 1, explanation: 'AVL 트리: 모든 노드의 |왼쪽 높이 - 오른쪽 높이| ≤ 1. 초과 시 회전(rotation)으로 재균형.' },
    { q: 'BST에서 30의 루트, 20 왼쪽, 40 오른쪽일 때 25를 삽입하면?', options: ['20의 왼쪽','20의 오른쪽','30의 왼쪽','40의 왼쪽'], answer: 1, explanation: '25 < 30 → 왼(20)으로 이동. 25 > 20 → 20의 오른쪽 자식으로 삽입.' },
  ],
  priorityqueue: [
    { q: 'Max-Heap에서 루트에 항상 있는 값은?', options: ['최솟값','중간값','최댓값','마지막 삽입값'], answer: 2, explanation: 'Max-Heap property: 부모 ≥ 자식. 루트는 전체에서 가장 큰 값.' },
    { q: '힙 삽입 후 수행하는 연산은?', options: ['heapify-down','heapify-up','순회','재구성'], answer: 1, explanation: '삽입: 완전 이진 트리 마지막에 추가 → heapify-up(부모와 비교하며 올라가기).' },
    { q: 'n개 원소를 힙으로 만드는 시간 복잡도는?', options: ['O(n log n)','O(n)','O(log n)','O(n²)'], answer: 1, explanation: '하향식 heapify: 절반 이상의 노드가 리프 → 전체 비용 O(n)으로 수렴.' },
    { q: '1-based 배열 힙에서 인덱스 i의 오른쪽 자식은?', options: ['2i','2i+1','i+1','i//2'], answer: 1, explanation: '1-based: 왼쪽=2i, 오른쪽=2i+1, 부모=i//2.' },
    { q: 'Dijkstra 최단 경로 알고리즘에서 우선순위 큐를 사용하는 이유는?', options: ['BFS를 위해','매 단계 최단 거리 정점을 O(log V)에 추출','DFS를 위해','사이클 감지'], answer: 1, explanation: '매 단계 미방문 정점 중 최단 거리를 가진 정점을 찾기 위해 Min-Heap 사용 → O(log V).' },
  ],
  hashtable: [
    { q: '해시 테이블의 평균 탐색 시간 복잡도는?', options: ['O(1)','O(log n)','O(n)','O(n log n)'], answer: 0, explanation: 'hash(key) % size로 배열 인덱스를 바로 계산 → O(1) 접근.' },
    { q: '체이닝으로 충돌을 해결하는 방법은?', options: ['다음 빈 슬롯에 저장','같은 버킷에 연결 리스트로 연결','배열 2배 확장','충돌 원소 버림'], answer: 1, explanation: '체이닝: 같은 해시 값을 가진 원소들을 연결 리스트로 같은 버킷에 저장.' },
    { q: '부하율(load factor)이 높아지면?', options: ['탐색 빨라짐','충돌 빈도 증가','메모리 절약','해시 함수 변경'], answer: 1, explanation: '부하율=저장수/배열크기. 높을수록 같은 버킷에 원소가 몰려 충돌 증가 → 성능 O(n) 근접.' },
    { q: 'Python dict와 Java HashMap 내부 구현은?', options: ['이진 탐색 트리','연결 리스트','해시 테이블','배열'], answer: 2, explanation: 'Python dict는 개방 주소법 해시 테이블, Java HashMap은 체이닝 해시 테이블.' },
    { q: '리해싱(Rehashing)이 발생하는 조건은?', options: ['원소 삭제','부하율이 임계값 초과','탐색 실패','빈 버킷 존재'], answer: 1, explanation: '부하율이 임계값(보통 0.75) 초과 시 배열을 2배로 늘리고 모든 원소를 재삽입.' },
  ],
  graph: [
    { q: 'n개 정점의 완전 그래프(무향)의 간선 수는?', options: ['n','n-1','n(n-1)/2','n²'], answer: 2, explanation: '모든 정점 쌍에 간선 → C(n,2) = n(n-1)/2.' },
    { q: '그래프 표현에서 인접 리스트가 인접 행렬보다 유리한 경우는?', options: ['간선이 매우 많은 밀집 그래프','간선이 적은 희소 그래프','정점 수가 적을 때','가중치 그래프'], answer: 1, explanation: '인접 리스트 공간: O(V+E). 희소 그래프(E ≪ V²)에서 인접 행렬 O(V²)보다 효율적.' },
    { q: 'BFS의 시간 복잡도는? (인접 리스트 기준)', options: ['O(V)','O(E)','O(V+E)','O(V·E)'], answer: 2, explanation: '각 정점 한 번, 각 간선 한 번 방문 → O(V+E).' },
    { q: '무향 그래프에서 모든 정점의 차수(degree) 합은?', options: ['|E|','2|E|','|V|','|V|+|E|'], answer: 1, explanation: '각 간선은 양쪽 정점의 차수를 1씩 증가 → 차수 합 = 2|E|.' },
    { q: 'DFS로 수행할 수 없는 것은?', options: ['사이클 감지','위상 정렬','최단 경로 탐색(비가중치)','연결 요소 탐색'], answer: 2, explanation: 'DFS는 최단 경로를 보장하지 않습니다. 비가중치 최단 경로는 BFS로 구합니다.' },
  ],
  weightedgraph: [
    { q: 'Dijkstra 알고리즘의 핵심 자료구조는?', options: ['스택','큐','우선순위 큐(Min-Heap)','해시 테이블'], answer: 2, explanation: '매 단계 최단 거리 미확정 정점을 O(log V)에 추출하기 위해 Min-Heap(우선순위 큐) 사용.' },
    { q: 'Dijkstra가 음수 가중치 간선에서 오동작하는 이유는?', options: ['공간 복잡도 초과','한번 확정된 거리가 이후 음수 간선으로 더 작아질 수 있어서','사이클 처리 불가','정점 수 제한'], answer: 1, explanation: 'Dijkstra는 한번 방문한 정점의 거리를 확정. 음수 간선이 있으면 이후에 더 짧은 경로가 생길 수 있어 오답.' },
    { q: '음수 가중치 간선이 있을 때 최단 경로 알고리즘은?', options: ['Dijkstra','Prim','Bellman-Ford','BFS'], answer: 2, explanation: 'Bellman-Ford: V-1번 모든 간선 완화(relaxation). 음수 사이클 감지도 가능. O(VE).' },
    { q: 'MST(최소 신장 트리)의 간선 수는?', options: ['V','V-1','E','E-1'], answer: 1, explanation: '신장 트리는 V개 정점을 사이클 없이 연결 → 항상 V-1개의 간선.' },
    { q: 'Kruskal MST 알고리즘의 시간 복잡도는?', options: ['O(V²)','O(E log V)','O(E log E)','O(VE)'], answer: 2, explanation: '간선을 가중치 오름차순 정렬: O(E log E). Union-Find로 사이클 검사: O(E·α(V)). 총 O(E log E).' },
  ],
  sorting: [
    { q: '비교 기반 정렬 알고리즘의 시간 복잡도 이론적 하한은? (최악 기준)', options: ['O(n)','O(n log n)','O(n²)','O(log n)'], answer: 1, explanation: '결정 트리의 리프 수 ≥ n! → 트리 높이(최악 비교 횟수) ≥ log(n!) = Θ(n log n). 어떤 비교 정렬도 최악의 경우 이보다 빠를 수 없음 (단, 삽입정렬 등의 best case는 O(n) 가능).' },
    { q: '안정 정렬(Stable Sort)이 아닌 것은?', options: ['합병 정렬','삽입 정렬','버블 정렬','힙 정렬'], answer: 3, explanation: '힙 정렬은 불안정 정렬. 힙 구조의 삽입·삭제가 같은 값의 상대 순서를 바꿀 수 있음.' },
    { q: '퀵 정렬의 최악 시간 복잡도는?', options: ['O(n log n)','O(n)','O(n²)','O(log n)'], answer: 2, explanation: '이미 정렬된 배열에서 한쪽 끝(첫·끝) 원소를 피벗으로 쓰면 n-1 : 0 으로 분할이 반복 → O(n²). 랜덤 피벗·median-of-3으로 회피.' },
    { q: '거의 정렬된 데이터에서 가장 효율적인 정렬은?', options: ['퀵 정렬','합병 정렬','삽입 정렬','힙 정렬'], answer: 2, explanation: '삽입 정렬: 거의 정렬 시 이동 횟수 거의 0 → O(n). Tim Sort도 이를 활용.' },
    { q: '힙 정렬의 시간 복잡도(최악)는?', options: ['O(n)','O(n log n)','O(n²)','O(log n)'], answer: 1, explanation: '힙 구성 O(n) + n번 extractMax O(n log n) = O(n log n). 최선·평균·최악 모두 동일.' },
  ],
}

export function buildFullQuiz() {
  const result = []
  for (const [dsId, qs] of Object.entries(QUIZZES)) {
    const picked = [...qs].sort(() => Math.random() - 0.5).slice(0, 2)
    picked.forEach(q => result.push({ ...q, dsId }))
  }
  return result.sort(() => Math.random() - 0.5)
}
