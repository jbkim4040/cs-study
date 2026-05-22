export const CATEGORIES = [
  { id: 'basic',     label: '기초 개념',    ids: ['pointer', 'list'] },
  { id: 'linear',   label: '선형 자료구조', ids: ['array', 'stack', 'queue', 'linkedlist', 'circular'] },
  { id: 'tree',     label: '트리',          ids: ['tree', 'bst', 'priorityqueue'] },
  { id: 'hashgraph',label: '해시 · 그래프', ids: ['hashtable', 'graph', 'weightedgraph'] },
  { id: 'sort',     label: '정렬',          ids: ['sorting'] },
]

export const STRUCTURES = [
  // ── 포인터 ───────────────────────────────────────────────────
  {
    id: 'pointer', name: '포인터', subtitle: 'Pointer',
    emoji: '👉', color: '#64748b', category: 'basic',
    tagline: '메모리 주소를 담는 변수 — 자료구조의 근간',
    concept: [
      '**포인터(Pointer)**는 다른 변수나 객체가 저장된 **메모리 주소**를 값으로 갖는 변수입니다.',
      '역참조(dereference)를 통해 포인터가 가리키는 주소의 실제 값을 읽거나 쓸 수 있습니다.',
      '연결 리스트·트리·그래프 등 거의 모든 동적 자료구조는 포인터(참조)로 노드를 연결합니다.',
    ],
    keyPoints: [
      '포인터 크기 = 시스템 주소 폭 (64비트 → 8바이트)',
      'NULL / None — 아무것도 가리키지 않는 포인터',
      '역참조(*ptr) — 주소에 저장된 값을 가져옴',
      '포인터 산술 — 배열 순회에 활용 (arr + i)',
    ],
    terminology: [
      { term: '포인터 변수', def: '메모리 주소를 값으로 저장하는 변수' },
      { term: '역참조 (Dereference)', def: '포인터가 가리키는 주소의 값에 접근하는 연산 (*ptr)' },
      { term: 'NULL 포인터', def: '아무 객체도 가리키지 않음을 나타내는 특수 값 (0번지)' },
      { term: '와일드 포인터', def: '초기화되지 않아 임의 주소를 가리키는 위험한 포인터' },
      { term: '댕글링 포인터', def: '해제된 메모리를 계속 가리키는 포인터 → 버그 원인' },
      { term: '주소 연산자 (&)', def: '변수의 메모리 주소를 반환' },
      { term: '스마트 포인터', def: 'C++ unique_ptr/shared_ptr처럼 자동 해제 관리하는 포인터' },
    ],
    adt: {
      description: '포인터는 타입이라기보다 개념이지만, 기본 연산으로 표현하면:',
      operations: [
        { sig: 'address(x)', desc: '변수 x의 메모리 주소 반환', complexity: 'O(1)' },
        { sig: 'deref(p)', desc: '포인터 p가 가리키는 값 반환', complexity: 'O(1)' },
        { sig: 'assign(p, x)', desc: '포인터 p가 가리키는 위치에 x 저장', complexity: 'O(1)' },
        { sig: 'isNull(p)', desc: 'p가 NULL인지 확인', complexity: 'O(1)' },
      ],
    },
    complexity: [
      { op: '역참조 (Deref)', avg: 'O(1)', worst: 'O(1)', note: '주소로 직접 접근' },
      { op: '주소 얻기', avg: 'O(1)', worst: 'O(1)', note: '컴파일러가 주소 알고 있음' },
    ],
    representation: [
      { title: '직접 주소 방식', desc: '실제 물리/가상 메모리 주소를 저장 (C 포인터)' },
      { title: '참조(Reference)', desc: 'Java/Python의 객체 참조 — 내부적으로 포인터, GC가 관리' },
    ],
    properties: [
      '64비트 시스템에서 모든 포인터의 크기는 8바이트 (타입 무관)',
      'NULL 포인터 역참조는 런타임 오류(Segfault/NullPointerException)',
      '포인터끼리 연산하면 바이트 단위가 아닌 자료형 크기 단위로 이동',
      '힙 메모리 할당 후 해제를 빠뜨리면 메모리 누수(Memory Leak) 발생',
    ],
    code: {
      python: `# Python에서는 명시적 포인터 없음 — 모든 변수가 참조
a = [1, 2, 3]
b = a          # b는 a와 같은 리스트를 가리킴 (포인터처럼)
b.append(4)
print(a)       # [1, 2, 3, 4] — 같은 객체!

# id()로 메모리 주소 확인
print(id(a))   # 예: 140234567
print(id(b))   # 같은 주소 → 같은 객체

# 복사(깊은 복사)로 독립된 객체 만들기
import copy
c = copy.copy(a)   # 얕은 복사
d = copy.deepcopy(a)  # 깊은 복사`,
      javascript: `// JS에서도 객체/배열은 참조(포인터)로 전달됨
const a = [1, 2, 3];
const b = a;       // b는 a와 같은 배열을 참조
b.push(4);
console.log(a);    // [1, 2, 3, 4]

// 독립 복사
const c = [...a];          // 얕은 복사
const d = JSON.parse(JSON.stringify(a)); // 깊은 복사

// C 스타일 포인터 의사 표현
// C: int x = 10; int *p = &x; *p = 20;
// → x는 이제 20`,
      java: `// Java: 명시적 포인터 없음 — 객체는 모두 참조(reference)
int[] a = {1, 2, 3};
int[] b = a;              // b는 a와 같은 배열을 참조
b[0] = 99;
System.out.println(a[0]); // 99 — 같은 객체!
System.out.println(a == b);       // true (참조 동일)

int[] c = a.clone();      // 독립 복사
System.out.println(a == c);       // false

int[] d = null;           // null — 아무것도 가리키지 않음
// d[0] 접근 시 → NullPointerException`,
      cpp: `#include <iostream>
int main() {
    int x = 10;
    int* p = &x;          // p는 x의 주소를 담음
    std::cout << *p;      // 10 — 역참조(dereference)
    *p = 20;              // p가 가리키는 곳에 저장
    std::cout << x;       // 20 — x가 바뀜

    int* np = nullptr;    // NULL 포인터
    // *np 접근 시 → 세그멘테이션 오류

    int arr[3] = {1, 2, 3};
    std::cout << *(arr + 2);  // 3 — 포인터 산술
}`,
      csharp: `// C#: 참조 타입(배열·객체)은 참조로 전달
int[] a = { 1, 2, 3 };
int[] b = a;                       // 같은 배열 참조
b[0] = 99;
Console.WriteLine(a[0]);                  // 99
Console.WriteLine(ReferenceEquals(a, b)); // True

// ref 키워드 — 값 타입을 참조로 전달
void AddOne(ref int n) => n++;
int x = 10;
AddOne(ref x);
Console.WriteLine(x);              // 11`,
    },
    useCases: [
      { name: '연결 리스트·트리·그래프', desc: '노드가 다음 노드의 주소(참조)를 들고 있어야 동적 자료구조를 이을 수 있습니다.' },
      { name: '동적 메모리 할당', desc: 'malloc·new로 힙에 잡은 메모리는 오직 포인터를 통해서만 접근합니다.' },
      { name: '함수 인자 참조 전달', desc: '값 대신 주소를 넘기면 함수가 원본을 직접 수정하고 큰 데이터 복사도 피합니다.' },
      { name: 'OS 커널·디바이스 드라이버', desc: '특정 하드웨어 주소를 포인터로 직접 가리켜 레지스터·메모리맵 I/O를 제어합니다.' },
    ],
    useCaseExample: {
      title: '함수 인자 참조 전달 — 두 값 맞바꾸기',
      desc: '값을 복사해 넘기면 함수 안의 변경이 원본에 반영되지 않습니다. **주소(포인터)**를 넘기면 함수가 호출자의 변수를 직접 바꿉니다.',
      code: `#include <stdio.h>

// 포인터로 원본의 주소를 받아 직접 교환
void swap(int* a, int* b) {
    int tmp = *a;   // a가 가리키는 값
    *a = *b;
    *b = tmp;
}

int main() {
    int x = 10, y = 20;
    swap(&x, &y);              // 변수의 '주소'를 전달
    printf("%d %d\\n", x, y);  // 20 10 — 원본이 바뀜
}`,
    },
  },

  // ── 리스트 ───────────────────────────────────────────────────
  {
    id: 'list', name: '리스트', subtitle: 'List (ADT)',
    emoji: '📋', color: '#0ea5e9', category: 'basic',
    tagline: '순서 있는 원소들의 모음 — 배열과 연결 리스트의 공통 추상',
    concept: [
      '**리스트(List)**는 원소들이 일정한 순서로 나열된 추상 자료형(ADT)입니다.',
      '배열 기반 리스트(ArrayList)와 연결 리스트 기반(LinkedList) 두 가지로 구현할 수 있으며, 각각 장단점이 다릅니다.',
      '순서(인덱스)로 원소를 구별하며, 같은 값이 여러 번 등장해도 위치가 다르면 다른 원소입니다.',
    ],
    keyPoints: [
      '원소 사이에 순서(순번) 존재',
      '인덱스 0 ~ n-1 (크기 n)',
      '같은 값도 서로 다른 위치에 중복 저장 가능',
      'Java ArrayList vs. Python list vs. JavaScript Array',
    ],
    terminology: [
      { term: '크기(Size)', def: '리스트에 저장된 원소의 개수' },
      { term: '위치(Index)', def: '원소의 순서 번호 (0-based)' },
      { term: '선행자(Predecessor)', def: '어떤 원소 바로 앞의 원소' },
      { term: '후계자(Successor)', def: '어떤 원소 바로 뒤의 원소' },
      { term: '공백 리스트', def: '원소가 하나도 없는 리스트' },
      { term: '커서(Cursor)', def: '현재 처리 중인 위치를 가리키는 포인터' },
    ],
    adt: {
      description: '리스트 ADT — 위치 기반 원소 관리',
      operations: [
        { sig: 'get(i)', desc: '인덱스 i의 원소 반환', complexity: 'O(1) / O(n)' },
        { sig: 'set(i, x)', desc: '인덱스 i의 원소를 x로 변경', complexity: 'O(1) / O(n)' },
        { sig: 'add(i, x)', desc: '인덱스 i 앞에 원소 x 삽입', complexity: 'O(n)' },
        { sig: 'remove(i)', desc: '인덱스 i의 원소 제거', complexity: 'O(n)' },
        { sig: 'size()', desc: '원소 개수 반환', complexity: 'O(1)' },
        { sig: 'isEmpty()', desc: '비어 있으면 true', complexity: 'O(1)' },
      ],
    },
    complexity: [
      { op: '배열 기반 접근', avg: 'O(1)', worst: 'O(1)', note: '인덱스 → 주소 직접 계산' },
      { op: '연결 기반 접근', avg: 'O(n)', worst: 'O(n)', note: '처음부터 k번 순회' },
      { op: '배열 기반 삽입', avg: 'O(n)', worst: 'O(n)', note: '뒤 원소 이동 필요' },
      { op: '연결 기반 삽입', avg: 'O(1)*', worst: 'O(n)', note: '*위치 포인터 이미 있을 때' },
    ],
    representation: [
      { title: '순차 표현 (배열 기반)', desc: '연속 메모리, 인덱스 O(1) 접근, 삽입·삭제 O(n)' },
      { title: '연결 표현 (포인터 기반)', desc: '분산 메모리, 삽입·삭제 O(1), 접근 O(n)' },
    ],
    properties: [
      '빈 리스트는 원소가 0개이며 유효한 리스트',
      '인덱스 범위 [0, size-1] 초과 접근은 IndexError',
      '배열 리스트의 동적 확장: 용량 초과 시 2배 크기 배열로 복사 → amortized O(1) append',
    ],
    classification: [
      { name: '배열 리스트 (ArrayList)', desc: '연속 메모리, O(1) 접근, O(n) 삽입·삭제' },
      { name: '연결 리스트 (LinkedList)', desc: '분산 메모리, O(n) 접근, O(1) 삽입·삭제' },
      { name: '이중 연결 리스트', desc: '앞뒤 양방향 탐색 가능' },
      { name: '순환 리스트', desc: '꼬리가 헤드를 가리키는 순환 구조' },
    ],
    code: {
      python: `# Python list = 동적 배열 기반 리스트
lst = [10, 20, 30, 40]

# O(1) 접근
print(lst[2])         # 30

# O(n) 중간 삽입
lst.insert(2, 99)     # [10, 20, 99, 30, 40]

# O(n) 중간 삭제
lst.pop(2)            # [10, 20, 30, 40]

# O(1) 끝 추가 (amortized)
lst.append(50)

# O(n) 탐색
print(30 in lst)      # True
print(lst.index(30))  # 2`,
      javascript: `// JS Array = 동적 배열 기반 리스트
const lst = [10, 20, 30, 40];

// O(1) 접근
console.log(lst[2]);         // 30

// O(n) 중간 삽입
lst.splice(2, 0, 99);        // [10, 20, 99, 30, 40]

// O(n) 중간 삭제
lst.splice(2, 1);            // [10, 20, 30, 40]

// O(1) 끝 추가 (amortized)
lst.push(50);

// O(n) 탐색
console.log(lst.includes(30)); // true
console.log(lst.indexOf(30));  // 2`,
      java: `import java.util.ArrayList;
import java.util.List;

ArrayList<Integer> lst = new ArrayList<>(List.of(10, 20, 30, 40));

System.out.println(lst.get(2));   // O(1) 접근 → 30
lst.add(2, 99);                   // O(n) 중간 삽입 → [10,20,99,30,40]
lst.remove(2);                    // O(n) 중간 삭제 → [10,20,30,40]
lst.add(50);                      // O(1) 끝 추가 (amortized)

System.out.println(lst.contains(30));  // O(n) 탐색 → true
System.out.println(lst.indexOf(30));   // 2`,
      cpp: `#include <vector>
#include <algorithm>
#include <iostream>

int main() {
    std::vector<int> lst = {10, 20, 30, 40};

    std::cout << lst[2];                  // O(1) 접근 → 30
    lst.insert(lst.begin() + 2, 99);      // O(n) 중간 삽입
    lst.erase(lst.begin() + 2);           // O(n) 중간 삭제
    lst.push_back(50);                    // O(1) 끝 추가

    auto it = std::find(lst.begin(), lst.end(), 30);  // O(n) 탐색
    std::cout << (it != lst.end());       // 1 (찾음)
}`,
      csharp: `var lst = new List<int> { 10, 20, 30, 40 };

Console.WriteLine(lst[2]);     // O(1) 접근 → 30
lst.Insert(2, 99);             // O(n) 중간 삽입 → [10,20,99,30,40]
lst.RemoveAt(2);               // O(n) 중간 삭제 → [10,20,30,40]
lst.Add(50);                   // O(1) 끝 추가 (amortized)

Console.WriteLine(lst.Contains(30));  // O(n) 탐색 → True
Console.WriteLine(lst.IndexOf(30));   // 2`,
    },
    useCases: [
      { name: '표준 라이브러리 리스트', desc: 'Python list·Java ArrayList·JS Array 모두 동적 배열 기반 리스트 ADT의 구현체입니다.' },
      { name: '순서 있는 데이터 관리', desc: '할 일 목록·재생 목록처럼 삽입 순서와 인덱스가 의미를 갖는 데이터를 다룹니다.' },
      { name: '스택·큐·덱의 기반', desc: '리스트에서 양 끝 연산만 노출하면 스택·큐·덱이 됩니다.' },
      { name: '알고리즘 입출력 버퍼', desc: '입력을 순서대로 모으고 결과를 순서대로 쌓는 버퍼로 쓰입니다.' },
    ],
    useCaseExample: {
      title: '음악 재생 목록 관리',
      desc: '곡을 순서대로 보관하고 다음 곡 재생·중간 삽입·삭제를 인덱스로 처리합니다 — 리스트의 가장 일상적인 쓰임입니다.',
      code: `playlist = ["Intro", "Verse", "Chorus"]

playlist.append("Outro")        # 끝에 곡 추가
playlist.insert(1, "Hook")      # 1번 위치에 삽입
playlist.pop(0)                 # 첫 곡 재생 완료 → 제거

now = 0
for i, song in enumerate(playlist):
    mark = "▶" if i == now else " "
    print(mark, song)`,
    },
  },

  // ── 배열 ─────────────────────────────────────────────────────
  {
    id: 'array', name: '배열', subtitle: 'Array',
    emoji: '📦', color: '#6366f1', category: 'linear',
    tagline: '인덱스로 O(1) 접근하는 연속 메모리 구조',
    concept: [
      '배열은 같은 타입의 데이터를 메모리에 **연속**으로 저장하는 가장 기본적인 자료구조입니다.',
      '시작 주소 + 인덱스 × 자료형 크기로 어느 원소든 한 번에 접근할 수 있어 O(1) 랜덤 접근이 가능합니다.',
      '중간 삽입·삭제 시 나머지 원소를 밀거나 당겨야 하므로 O(n)이 걸립니다.',
    ],
    keyPoints: [
      '연속된 메모리 → 캐시 히트율 높음',
      'arr[i] = base + i × sizeof(T) → O(1)',
      '정적 배열(고정 크기) vs 동적 배열(자동 리사이즈)',
      '중간 삽입·삭제 O(n), 끝 추가 O(1)',
    ],
    terminology: [
      { term: '인덱스(Index)', def: '배열 원소의 순서 번호, 0부터 시작' },
      { term: '기저 주소(Base Address)', def: '배열의 첫 번째 원소가 저장된 메모리 주소' },
      { term: '원소(Element)', def: '배열에 저장된 개별 데이터 값' },
      { term: '차원(Dimension)', def: '1차원(벡터), 2차원(행렬), N차원 배열' },
      { term: '행 우선 순서', def: '2D 배열에서 행(row) 단위로 메모리에 연속 저장 (C/Python)' },
      { term: '열 우선 순서', def: '2D 배열에서 열(column) 단위로 저장 (Fortran/MATLAB)' },
    ],
    adt: {
      description: '배열 ADT — 인덱스 기반 원소 접근',
      operations: [
        { sig: 'get(i)', desc: '인덱스 i의 원소 반환', complexity: 'O(1)' },
        { sig: 'set(i, x)', desc: '인덱스 i에 x 저장', complexity: 'O(1)' },
        { sig: 'length()', desc: '배열 크기 반환', complexity: 'O(1)' },
      ],
    },
    complexity: [
      { op: '접근 (Access)', avg: 'O(1)', worst: 'O(1)', note: '인덱스로 주소 직접 계산' },
      { op: '탐색 (Search)', avg: 'O(n)', worst: 'O(n)', note: '처음부터 순서대로 비교' },
      { op: '중간 삽입', avg: 'O(n)', worst: 'O(n)', note: '이후 원소 전부 한 칸 이동' },
      { op: '중간 삭제', avg: 'O(n)', worst: 'O(n)', note: '이후 원소 전부 한 칸 당김' },
      { op: '끝에 추가', avg: 'O(1)', worst: 'O(1)', note: '이동 불필요' },
    ],
    representation: [
      { title: '정적 배열', desc: '컴파일 시 크기 결정, 스택/전역 메모리, 크기 변경 불가' },
      { title: '동적 배열', desc: '힙 메모리, 런타임 크기 결정, 용량 초과 시 2배 확장 후 복사' },
    ],
    properties: [
      '모든 원소는 같은 자료형이므로 원소 크기가 고정',
      '2D 배열 arr[i][j]의 주소 = base + (i*cols + j) * sizeof(T)',
      '동적 배열의 amortized append: 총 복사 비용 = n + n/2 + n/4 + … = O(n) → 한 번당 O(1)',
    ],
    classification: [
      { name: '1차원 배열', desc: '선형 배열, 벡터' },
      { name: '다차원 배열', desc: '2D(행렬), 3D 이상' },
      { name: '정적 배열', desc: 'C의 int arr[10] — 크기 고정' },
      { name: '동적 배열', desc: 'Python list, C++ vector — 자동 확장' },
    ],
    code: {
      python: `arr = [15, 42, 8, 73, 21]

# O(1) 인덱스 접근
print(arr[2])       # 8

# O(n) 탐색
print(73 in arr)    # True

# O(n) 중간 삽입 (index 2)
arr.insert(2, 99)   # [15, 42, 99, 8, 73, 21]

# O(n) 중간 삭제 (index 2)
arr.pop(2)          # [15, 42, 8, 73, 21]

# O(1) 끝 추가
arr.append(56)

# 2차원 배열
matrix = [[1,2,3],[4,5,6],[7,8,9]]
print(matrix[1][2])  # 6`,
      javascript: `const arr = [15, 42, 8, 73, 21];

// O(1) 인덱스 접근
console.log(arr[2]);         // 8

// O(n) 탐색
console.log(arr.includes(73)); // true

// O(n) 중간 삽입 (index 2)
arr.splice(2, 0, 99);

// O(n) 중간 삭제 (index 2)
arr.splice(2, 1);

// O(1) 끝 추가
arr.push(56);

// 2차원 배열
const m = [[1,2,3],[4,5,6],[7,8,9]];
console.log(m[1][2]); // 6`,
      java: `int[] arr = {15, 42, 8, 73, 21};

System.out.println(arr[2]);       // O(1) 인덱스 접근 → 8
System.out.println(arr.length);   // 5

boolean found = false;            // O(n) 탐색
for (int v : arr) if (v == 73) found = true;
System.out.println(found);        // true

// 2차원 배열
int[][] m = {{1,2,3}, {4,5,6}, {7,8,9}};
System.out.println(m[1][2]);      // 6`,
      cpp: `#include <iostream>
int main() {
    int arr[5] = {15, 42, 8, 73, 21};

    std::cout << arr[2];       // O(1) 인덱스 접근 → 8
    std::cout << *(arr + 3);   // 73 — 주소 = base + i*sizeof(int)

    bool found = false;        // O(n) 탐색
    for (int v : arr) if (v == 73) found = true;

    int m[3][3] = {{1,2,3}, {4,5,6}, {7,8,9}};
    std::cout << m[1][2];      // 6
}`,
      csharp: `int[] arr = { 15, 42, 8, 73, 21 };

Console.WriteLine(arr[2]);                  // O(1) 인덱스 접근 → 8
Console.WriteLine(arr.Length);              // 5
Console.WriteLine(Array.IndexOf(arr, 73));  // O(n) 탐색 → 3

// 다차원 배열
int[,] m = { {1,2,3}, {4,5,6}, {7,8,9} };
Console.WriteLine(m[1, 2]);                 // 6`,
    },
    useCases: [
      { name: '이미지 픽셀 버퍼', desc: '이미지는 픽셀(RGB) 값을 행 우선 순서로 늘어놓은 2차원 배열입니다.' },
      { name: '행렬·벡터 연산', desc: '연속 메모리라 CPU 캐시 적중률이 높아 수치 연산의 기본 자료형입니다.' },
      { name: '정렬 알고리즘 기반', desc: '대부분의 정렬은 배열의 O(1) 인덱스 접근·교환 위에서 동작합니다.' },
      { name: '해시 테이블 버킷', desc: '해시 값을 인덱스로 쓰는 버킷 배열이 해시 테이블의 뼈대입니다.' },
    ],
    useCaseExample: {
      title: '이미지 밝기 조절',
      desc: '이미지를 2차원 배열로 보고 각 픽셀 값을 더해 전체 밝기를 올립니다. 인덱스 직접 접근이라 O(행 × 열)에 처리됩니다.',
      code: `# 3x3 그레이스케일 이미지 (0~255)
image = [
    [100, 120, 130],
    [ 90, 110, 140],
    [ 80, 105, 150],
]

# 모든 픽셀을 +40 (최대 255로 클램프)
for r in range(len(image)):
    for c in range(len(image[0])):
        image[r][c] = min(255, image[r][c] + 40)

print(image[0])   # [140, 160, 170]`,
    },
  },

  // ── 스택 ─────────────────────────────────────────────────────
  {
    id: 'stack', name: '스택', subtitle: 'Stack',
    emoji: '🥞', color: '#f59e0b', category: 'linear',
    tagline: '마지막에 넣은 것이 가장 먼저 나오는 LIFO 구조',
    concept: [
      '스택은 **LIFO(Last In First Out)** — 가장 마지막에 삽입한 원소가 가장 먼저 삭제됩니다.',
      '접시 쌓기처럼 꼭대기(top)에서만 삽입(push)·삭제(pop)가 일어납니다.',
      '삽입·삭제가 항상 한쪽 끝에서만 일어나므로 두 연산 모두 O(1)입니다.',
    ],
    keyPoints: [
      'push — 꼭대기에 추가 O(1)',
      'pop — 꼭대기에서 제거 O(1)',
      'peek/top — 꼭대기 값 확인 O(1) (제거 없음)',
      '빈 스택에서 pop → Stack Underflow',
    ],
    terminology: [
      { term: '꼭대기(Top)', def: '가장 최근에 삽입된 원소, 삭제·접근 위치' },
      { term: '바닥(Bottom)', def: '가장 먼저 삽입된 원소가 있는 위치' },
      { term: 'Stack Overflow', def: '고정 크기 스택이 꽉 찬 상태에서 push 시도' },
      { term: 'Stack Underflow', def: '빈 스택에서 pop/peek 시도' },
      { term: '활성 레코드', def: '함수 호출 시 스택에 쌓이는 프레임 (지역변수, 반환주소)' },
    ],
    adt: {
      description: '스택 ADT — 한쪽 끝에서만 삽입·삭제',
      operations: [
        { sig: 'push(x)', desc: '원소 x를 꼭대기에 삽입', complexity: 'O(1)' },
        { sig: 'pop()', desc: '꼭대기 원소 제거 후 반환', complexity: 'O(1)' },
        { sig: 'peek()', desc: '꼭대기 원소 반환 (제거 없음)', complexity: 'O(1)' },
        { sig: 'isEmpty()', desc: '스택이 비어있으면 true', complexity: 'O(1)' },
        { sig: 'size()', desc: '원소 개수 반환', complexity: 'O(1)' },
      ],
    },
    complexity: [
      { op: 'Push', avg: 'O(1)', worst: 'O(1)', note: '꼭대기에 추가' },
      { op: 'Pop', avg: 'O(1)', worst: 'O(1)', note: '꼭대기에서 제거' },
      { op: 'Peek', avg: 'O(1)', worst: 'O(1)', note: '꼭대기 값 조회' },
      { op: '탐색', avg: 'O(n)', worst: 'O(n)', note: '꼭대기부터 하나씩 확인' },
    ],
    representation: [
      { title: '배열 기반', desc: '배열 + top 인덱스 변수. 크기 제한 있음, 캐시 효율 좋음' },
      { title: '연결 리스트 기반', desc: '헤드에 push/pop. 크기 무제한, 노드 당 포인터 메모리 추가' },
    ],
    properties: [
      'n번 push 후 n번 pop하면 LIFO 순서로 원소가 반환됨',
      '재귀 호출은 암묵적으로 콜 스택을 사용',
      '스택으로 재귀 알고리즘을 반복문으로 변환 가능',
    ],
    code: {
      python: `stack = []

stack.append(10); stack.append(20); stack.append(30)
# top → 30

top = stack[-1]    # peek: 30
val = stack.pop()  # pop: 30

# 괄호 유효성 검사
def is_valid(s):
    stack = []
    for c in s:
        if c in '([{': stack.append(c)
        elif c in ')]}':
            if not stack: return False
            if stack[-1]+c not in ('()','[]','{}'): return False
            stack.pop()
    return not stack`,
      javascript: `const stack = [];

stack.push(10); stack.push(20); stack.push(30);
// top → 30

const top = stack[stack.length - 1]; // peek: 30
const val = stack.pop();             // pop: 30

// 괄호 유효성 검사
function isValid(s) {
  const st = [], match = {')':'(',']':'[','}':'{'};
  for (const c of s) {
    if ('([{'.includes(c)) st.push(c);
    else if (c in match) {                 // 닫는 괄호일 때만 검사
      if (st.pop() !== match[c]) return false;
    }
  }
  return st.length === 0;
}`,
      java: `import java.util.ArrayDeque;
import java.util.Deque;

Deque<Integer> stack = new ArrayDeque<>();
stack.push(10); stack.push(20); stack.push(30);  // top → 30

System.out.println(stack.peek());  // 30 (제거 없음)
System.out.println(stack.pop());   // 30

// 괄호 유효성 검사
static boolean isValid(String s) {
    Deque<Character> st = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        if (c=='('||c=='['||c=='{') st.push(c);
        else {
            if (st.isEmpty()) return false;
            char o = st.pop();
            if ((c==')'&&o!='(')||(c==']'&&o!='[')||(c=='}'&&o!='{'))
                return false;
        }
    }
    return st.isEmpty();
}`,
      cpp: `#include <stack>
#include <string>
#include <iostream>

// 괄호 유효성 검사
bool isValid(const std::string& s) {
    std::stack<char> st;
    for (char c : s) {
        if (c=='('||c=='['||c=='{') st.push(c);
        else {
            if (st.empty()) return false;
            char o = st.top(); st.pop();
            if ((c==')'&&o!='(')||(c==']'&&o!='[')||(c=='}'&&o!='{'))
                return false;
        }
    }
    return st.empty();
}

int main() {
    std::stack<int> st;
    st.push(10); st.push(20); st.push(30);  // top → 30
    std::cout << st.top();          // 30 (peek)
    st.pop();                       // 30 제거
    std::cout << isValid("({[]})"); // 1
}`,
      csharp: `var stack = new Stack<int>();
stack.Push(10); stack.Push(20); stack.Push(30);  // top → 30

Console.WriteLine(stack.Peek());  // 30 (제거 없음)
Console.WriteLine(stack.Pop());   // 30

// 괄호 유효성 검사
bool IsValid(string s) {
    var st = new Stack<char>();
    var match = new Dictionary<char,char> { [')']='(', [']']='[', ['}']='{' };
    foreach (char c in s) {
        if (c=='('||c=='['||c=='{') st.Push(c);
        else if (match.ContainsKey(c)) {
            if (st.Count==0 || st.Pop()!=match[c]) return false;
        }
    }
    return st.Count == 0;
}`,
    },
    useCases: [
      { name: '함수 호출 스택', desc: '함수 호출마다 스택 프레임이 쌓이고 반환할 때 LIFO 순서로 정리됩니다.' },
      { name: '실행 취소 (Undo)', desc: '작업을 스택에 쌓아두고 pop하면 가장 최근 작업부터 되돌립니다.' },
      { name: 'DFS (깊이 우선 탐색)', desc: '방문할 노드를 스택에 넣어 가장 깊은 경로부터 탐색합니다.' },
      { name: '괄호·태그 검사', desc: '여는 기호는 push, 닫는 기호에서 pop해 짝이 맞는지 확인합니다.' },
      { name: '후위 표기법 계산', desc: '피연산자를 쌓다가 연산자를 만나면 pop해서 계산합니다.' },
    ],
    vizSync: {
      bridge: 'stack',
      syncCode: `// StackViz와 연동됩니다 — viz 객체로 시각화를 제어하세요
await viz.reset();
await viz.push(10);
await viz.push(20);
await viz.push(30);
console.log("peek:", viz.peek());
console.log("pop:", await viz.pop());
console.log("pop:", await viz.pop());
console.log("size:", viz.size());`,
      codeLines: { reset: 2, push: 3, pop: 7, peek: 6 },
    },
    useCaseExample: {
      title: '에디터 실행 취소 (Undo)',
      desc: '사용자가 글자를 입력할 때마다 직전 상태를 스택에 기록하고, Ctrl+Z를 누르면 가장 최근 상태를 pop해 되돌립니다.',
      code: `history = []          # 작업 스택
text = ""

def type_char(c):
    global text
    history.append(text)   # 현재 상태를 저장
    text += c

def undo():
    global text
    if history:
        text = history.pop()   # 직전 상태로 복원

type_char("H"); type_char("i"); type_char("!")
print(text)   # Hi!
undo()
print(text)   # Hi`,
    },
  },

  // ── 큐 ───────────────────────────────────────────────────────
  {
    id: 'queue', name: '큐', subtitle: 'Queue',
    emoji: '🚶', color: '#10b981', category: 'linear',
    tagline: '먼저 들어온 것이 먼저 나가는 FIFO 줄서기 구조',
    concept: [
      '큐는 **FIFO(First In First Out)** — 먼저 삽입한 원소가 먼저 삭제됩니다.',
      '삽입은 rear(뒤), 삭제는 front(앞)에서만 일어납니다.',
      '선형 큐는 배열 낭비 문제가 있어 실제로는 **원형 큐** 또는 연결 리스트 기반으로 구현합니다.',
    ],
    keyPoints: [
      'enqueue — rear에 추가 O(1)',
      'dequeue — front에서 제거 O(1)',
      'front/rear 포인터로 양 끝 추적',
      '원형 큐: (idx + 1) % capacity 로 공간 재사용',
    ],
    terminology: [
      { term: 'Front', def: '삭제가 일어나는 앞쪽 끝' },
      { term: 'Rear', def: '삽입이 일어나는 뒤쪽 끝' },
      { term: '원형 큐(Circular Queue)', def: '배열 끝과 앞이 연결된 형태로 공간 낭비 없음' },
      { term: '덱(Deque)', def: '앞뒤 양쪽에서 삽입·삭제 가능한 큐의 확장형' },
      { term: '우선순위 큐', def: '원소에 우선순위를 부여해 높은 것부터 꺼내는 큐' },
    ],
    adt: {
      description: '큐 ADT — 양 끝이 다른 삽입·삭제',
      operations: [
        { sig: 'enqueue(x)', desc: 'rear에 원소 x 삽입', complexity: 'O(1)' },
        { sig: 'dequeue()', desc: 'front 원소 제거 후 반환', complexity: 'O(1)' },
        { sig: 'peek()', desc: 'front 원소 확인 (제거 없음)', complexity: 'O(1)' },
        { sig: 'isEmpty()', desc: '큐가 비어있으면 true', complexity: 'O(1)' },
        { sig: 'size()', desc: '원소 개수 반환', complexity: 'O(1)' },
      ],
    },
    complexity: [
      { op: 'Enqueue', avg: 'O(1)', worst: 'O(1)', note: 'rear에 추가' },
      { op: 'Dequeue', avg: 'O(1)', worst: 'O(1)', note: 'front에서 제거' },
      { op: 'Peek', avg: 'O(1)', worst: 'O(1)', note: 'front 조회' },
      { op: '탐색', avg: 'O(n)', worst: 'O(n)', note: 'front부터 순서대로' },
    ],
    representation: [
      { title: '배열 기반 원형 큐', desc: '고정 배열 + front/rear 인덱스, (idx+1)%cap 로 순환' },
      { title: '연결 리스트 기반', desc: 'head = front, tail = rear. 동적 크기, 포인터 비용 추가' },
    ],
    properties: [
      '원형 큐 공백 조건: front == rear',
      '원형 큐 포화 조건: (rear + 1) % cap == front',
      'BFS는 큐를 사용해 레벨 단위로 그래프를 탐색',
    ],
    code: {
      python: `from collections import deque
q = deque()

q.append(10); q.append(20); q.append(30)
# front: 10

front = q[0]           # peek
val = q.popleft()      # dequeue: 10

# BFS 예시
def bfs(graph, start):
    visited, queue = {start}, deque([start])
    while queue:
        v = queue.popleft()
        for u in graph[v]:
            if u not in visited:
                visited.add(u); queue.append(u)`,
      javascript: `class Queue {
  #d = []; #h = 0;
  enqueue(v) { this.#d.push(v); }
  dequeue()  { return this.#d[this.#h++]; }
  peek()     { return this.#d[this.#h]; }
  size()     { return this.#d.length - this.#h; }
}

const q = new Queue();
q.enqueue(10); q.enqueue(20); q.enqueue(30);
console.log(q.dequeue()); // 10
console.log(q.peek());    // 20`,
      java: `import java.util.LinkedList;
import java.util.Queue;

Queue<Integer> q = new LinkedList<>();
q.offer(10); q.offer(20); q.offer(30);  // front: 10

System.out.println(q.peek());  // 10 (제거 없음)
System.out.println(q.poll());  // dequeue → 10

// 원형 큐 핵심: (idx + 1) % capacity 로 공간 재사용
int cap = 5, rear = 4;
rear = (rear + 1) % cap;       // 0 — 배열 앞으로 순환`,
      cpp: `#include <queue>
#include <iostream>

int main() {
    std::queue<int> q;
    q.push(10); q.push(20); q.push(30);  // front: 10

    std::cout << q.front();  // 10 (peek)
    q.pop();                 // dequeue → 10

    // 원형 큐 핵심: (idx + 1) % capacity 로 공간 재사용
    int cap = 5, rear = 4;
    rear = (rear + 1) % cap; // 0 — 배열 앞으로 순환
    std::cout << rear;
}`,
      csharp: `var q = new Queue<int>();
q.Enqueue(10); q.Enqueue(20); q.Enqueue(30);  // front: 10

Console.WriteLine(q.Peek());     // 10 (제거 없음)
Console.WriteLine(q.Dequeue());  // dequeue → 10

// 원형 큐 핵심: (idx + 1) % capacity 로 공간 재사용
int cap = 5, rear = 4;
rear = (rear + 1) % cap;         // 0 — 배열 앞으로 순환`,
    },
    useCases: [
      { name: 'BFS (너비 우선 탐색)', desc: '가까운 노드부터 큐에 넣어 레벨 순서로 탐색 — 가중치 없는 최단 경로를 찾습니다.' },
      { name: '프린터 인쇄 큐', desc: '먼저 요청한 문서가 먼저 출력되도록 작업을 FIFO로 줄 세웁니다.' },
      { name: 'CPU 스케줄링', desc: '준비 상태의 프로세스를 준비 큐에 담아 순서대로 CPU를 배정합니다.' },
      { name: '이벤트 처리', desc: '클릭·키 입력 등 이벤트를 발생 순서대로 큐에 모아 차례로 처리합니다.' },
      { name: '네트워크 버퍼', desc: '도착한 패킷을 순서대로 큐에 담아 처리 속도 차이를 흡수합니다.' },
    ],
    vizSync: {
      bridge: 'queue',
      syncCode: `// QueueViz와 연동됩니다 — viz 객체로 시각화를 제어하세요
await viz.reset();
await viz.enqueue(10);
await viz.enqueue(20);
await viz.enqueue(30);
console.log("peek:", JSON.stringify(viz.peek()));
console.log("dequeue:", await viz.dequeue());
console.log("dequeue:", await viz.dequeue());
console.log("size:", viz.size());`,
      codeLines: { reset: 2, enqueue: 3, dequeue: 7, peek: 6 },
    },
    useCaseExample: {
      title: '프린터 작업 대기열',
      desc: '여러 사용자가 보낸 인쇄 작업을 도착 순서대로 큐에 담고, 프린터는 앞(front)에서부터 하나씩 꺼내 출력합니다.',
      code: `from collections import deque

printer_queue = deque()

def submit(doc):
    printer_queue.append(doc)         # 작업 등록 (rear)
    print(f"대기 등록: {doc}")

def print_next():
    if printer_queue:
        doc = printer_queue.popleft()  # 가장 먼저 온 작업 (front)
        print(f"출력 중: {doc}")

submit("보고서.pdf"); submit("사진.jpg")
print_next()   # 출력 중: 보고서.pdf
print_next()   # 출력 중: 사진.jpg`,
    },
  },

  // ── 연결 리스트 ───────────────────────────────────────────────
  {
    id: 'linkedlist', name: '연결 리스트', subtitle: 'Linked List',
    emoji: '🔗', color: '#3b82f6', category: 'linear',
    tagline: '포인터로 연결된 노드 사슬 — 동적 삽입·삭제에 강함',
    concept: [
      '**노드(Node)** 단위가 포인터(참조)로 이어진 자료구조로, 각 노드는 데이터와 다음 노드의 주소를 함께 가집니다.',
      '배열과 달리 메모리가 연속하지 않아도 되며, 크기가 동적으로 변합니다.',
      '임의 인덱스 접근이 불가능 — k번째 노드를 찾으려면 헤드부터 k번 포인터를 따라가야 합니다.',
    ],
    keyPoints: [
      '노드 = 데이터 + next 포인터',
      '헤드 삽입·삭제 O(1) — 포인터 교체만 필요',
      '임의 위치 접근·탐색 O(n)',
      '단방향 · 양방향 · 순환 세 가지 종류',
    ],
    terminology: [
      { term: '헤드(Head)', def: '연결 리스트의 첫 번째 노드' },
      { term: '꼬리(Tail)', def: 'next가 NULL인 마지막 노드' },
      { term: '센티넬 노드', def: '실제 데이터가 없는 더미 헤드/꼬리 노드 — 경계 처리 단순화' },
      { term: '선행자(Predecessor)', def: '어떤 노드의 바로 앞 노드' },
      { term: '후계자(Successor)', def: '어떤 노드의 next가 가리키는 노드' },
    ],
    adt: {
      description: '연결 리스트 ADT',
      operations: [
        { sig: 'prepend(x)', desc: '헤드 앞에 삽입', complexity: 'O(1)' },
        { sig: 'append(x)', desc: '꼬리 뒤에 삽입', complexity: 'O(n) / O(1)*' },
        { sig: 'insertAfter(node, x)', desc: 'node 뒤에 삽입', complexity: 'O(1)' },
        { sig: 'deleteHead()', desc: '헤드 노드 제거', complexity: 'O(1)' },
        { sig: 'search(x)', desc: '값 x를 가진 노드 탐색', complexity: 'O(n)' },
      ],
    },
    complexity: [
      { op: '접근', avg: 'O(n)', worst: 'O(n)', note: '처음부터 순회' },
      { op: '탐색', avg: 'O(n)', worst: 'O(n)', note: '처음부터 비교' },
      { op: '헤드 삽입', avg: 'O(1)', worst: 'O(1)', note: '포인터 2개 교체' },
      { op: '임의 삽입', avg: 'O(n)', worst: 'O(n)', note: '위치까지 순회 후 삽입' },
      { op: '헤드 삭제', avg: 'O(1)', worst: 'O(1)', note: 'head = head.next' },
    ],
    representation: [
      { title: '단방향(Singly)', desc: '각 노드에 next 포인터 1개. 역방향 탐색 불가' },
      { title: '양방향(Doubly)', desc: 'prev + next 포인터. 역방향 탐색 가능, 메모리 2배' },
    ],
    properties: [
      'n개 노드의 연결 리스트는 n개의 next 포인터를 가짐',
      '양방향 연결 리스트는 삭제 시 이전 노드 탐색 불필요 → O(1)',
      'tail 포인터를 별도로 유지하면 append도 O(1) 가능',
    ],
    classification: [
      { name: '단방향', desc: 'next 포인터만 — 앞방향 순회' },
      { name: '양방향', desc: 'prev + next — 양방향 순회, LRU 캐시' },
      { name: '순환', desc: 'tail.next = head — 끝이 없는 순환' },
    ],
    code: {
      python: `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self): self.head = None

    def prepend(self, data):   # O(1)
        n = Node(data); n.next = self.head; self.head = n

    def append(self, data):    # O(n)
        n = Node(data)
        if not self.head: self.head = n; return
        cur = self.head
        while cur.next: cur = cur.next
        cur.next = n

    def delete_head(self):     # O(1)
        if self.head: self.head = self.head.next`,
      javascript: `class Node { constructor(d){this.data=d;this.next=null;} }

class LinkedList {
  constructor(){this.head=null;}

  prepend(data){          // O(1)
    const n=new Node(data); n.next=this.head; this.head=n;
  }
  append(data){           // O(n)
    const n=new Node(data);
    if(!this.head){this.head=n;return;}
    let c=this.head; while(c.next)c=c.next; c.next=n;
  }
  deleteHead(){           // O(1)
    if(this.head)this.head=this.head.next;
  }
}`,
      java: `class Node {
    int data; Node next;
    Node(int d) { data = d; }
}

class LinkedList {
    Node head;

    void prepend(int data) {     // O(1)
        Node n = new Node(data);
        n.next = head; head = n;
    }
    void append(int data) {      // O(n)
        Node n = new Node(data);
        if (head == null) { head = n; return; }
        Node cur = head;
        while (cur.next != null) cur = cur.next;
        cur.next = n;
    }
    void deleteHead() {          // O(1)
        if (head != null) head = head.next;
    }
}`,
      cpp: `struct Node {
    int data;
    Node* next = nullptr;
    Node(int d) : data(d) {}
};

class LinkedList {
    Node* head = nullptr;
public:
    void prepend(int data) {     // O(1)
        Node* n = new Node(data);
        n->next = head; head = n;
    }
    void append(int data) {      // O(n)
        Node* n = new Node(data);
        if (!head) { head = n; return; }
        Node* cur = head;
        while (cur->next) cur = cur->next;
        cur->next = n;
    }
    void deleteHead() {          // O(1)
        if (head) { Node* old = head; head = head->next; delete old; }
    }
};`,
      csharp: `class Node {
    public int Data;
    public Node Next;
    public Node(int d) => Data = d;
}

class LinkedList {
    Node head;

    public void Prepend(int data) {   // O(1)
        head = new Node(data) { Next = head };
    }
    public void Append(int data) {    // O(n)
        var n = new Node(data);
        if (head == null) { head = n; return; }
        var cur = head;
        while (cur.Next != null) cur = cur.Next;
        cur.Next = n;
    }
    public void DeleteHead() {        // O(1)
        if (head != null) head = head.Next;
    }
}`,
    },
    useCases: [
      { name: '스택·큐 내부 구현', desc: '헤드·꼬리 삽입·삭제가 O(1)이라 크기 제한 없는 스택·큐를 만듭니다.' },
      { name: 'LRU 캐시', desc: '양방향 연결 리스트로 최근 사용한 항목을 O(1)에 맨 앞으로 옮깁니다.' },
      { name: '파일 시스템 디렉터리', desc: '한 디렉터리의 파일 목록을 노드 사슬로 이어 동적으로 추가·삭제합니다.' },
      { name: '다항식 표현', desc: '각 항(계수·차수)을 노드로 만들어 희소한 다항식을 메모리 효율적으로 다룹니다.' },
    ],
    useCaseExample: {
      title: '음악 플레이어 — 다음 곡 잇기',
      desc: '각 곡 노드가 next로 다음 곡을 가리킵니다. 곡 추가가 포인터 교체만으로 O(1)에 끝나 배열보다 유리합니다.',
      code: `class Song:
    def __init__(self, title):
        self.title = title
        self.next = None

# 곡을 사슬로 연결
head = Song("Track 1")
head.next = Song("Track 2")
head.next.next = Song("Track 3")

# 헤드부터 순회하며 재생
cur = head
while cur:
    print("재생:", cur.title)
    cur = cur.next`,
    },
  },

  // ── 순환 ─────────────────────────────────────────────────────
  {
    id: 'circular', name: '순환 리스트', subtitle: 'Circular List',
    emoji: '🔄', color: '#a855f7', category: 'linear',
    tagline: '꼬리가 헤드를 가리키는 끝없는 고리 구조',
    concept: [
      '**순환 연결 리스트**는 마지막 노드의 next 포인터가 NULL이 아니라 헤드(또는 특정 노드)를 가리킵니다.',
      '리스트에 끝이 없기 때문에 임의의 노드에서 출발해도 전체를 순회할 수 있습니다.',
      '원형 큐, 라운드로빈 스케줄러, 버퍼처럼 "계속 돌아가는" 구조를 자연스럽게 표현합니다.',
    ],
    keyPoints: [
      'tail.next = head (단방향 순환)',
      '종료 조건: 시작 노드에 다시 도달했을 때',
      '순환 감지: Floyd 알고리즘 (토끼·거북이)',
      '단방향·양방향 모두 순환 가능',
    ],
    terminology: [
      { term: '순환 포인터', def: '꼬리 노드의 next가 헤드(또는 임의 노드)를 가리키는 포인터' },
      { term: '진입점(Entry Point)', def: '순환 리스트 탐색을 시작하는 기준 노드' },
      { term: 'Floyd 알고리즘', def: '느린 포인터(1칸)와 빠른 포인터(2칸)로 사이클 감지' },
      { term: '원형 큐', def: '배열 기반 큐를 순환 인덱스로 구현 — 공간 낭비 없음' },
    ],
    adt: {
      description: '순환 리스트 ADT (단방향 기준)',
      operations: [
        { sig: 'insert(x)', desc: '임의 위치에 노드 삽입', complexity: 'O(1)*' },
        { sig: 'delete(x)', desc: '값 x를 가진 노드 삭제', complexity: 'O(n)' },
        { sig: 'traverse()', desc: '모든 노드를 순서대로 방문', complexity: 'O(n)' },
        { sig: 'hasCycle()', desc: 'Floyd 알고리즘으로 사이클 감지', complexity: 'O(n)' },
      ],
    },
    complexity: [
      { op: '헤드 삽입', avg: 'O(1)', worst: 'O(1)', note: '포인터 교체' },
      { op: '임의 삭제', avg: 'O(n)', worst: 'O(n)', note: '위치까지 탐색' },
      { op: '전체 순회', avg: 'O(n)', worst: 'O(n)', note: '시작점까지 돌아올 때 종료' },
      { op: '사이클 감지', avg: 'O(n)', worst: 'O(n)', note: 'Floyd 2포인터' },
    ],
    representation: [
      { title: '단방향 순환', desc: 'tail.next = head. 단방향 탐색만 가능' },
      { title: '양방향 순환', desc: 'tail.next = head AND head.prev = tail. 양방향 탐색' },
    ],
    properties: [
      'NULL 종단이 없어 순회 시 시작 노드 기준으로 종료 조건 명시 필요',
      'Floyd 알고리즘: slow=slow.next, fast=fast.next.next → 만나면 사이클 존재',
      '원형 큐: front == rear이면 공백, (rear+1)%cap == front이면 포화',
    ],
    code: {
      python: `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

# 순환 연결 리스트 생성
n1, n2, n3 = Node(10), Node(20), Node(30)
n1.next = n2; n2.next = n3; n3.next = n1  # 순환!

# 순회 (시작 노드 기준으로 종료)
def traverse(head):
    if not head: return
    cur = head
    while True:
        print(cur.data)
        cur = cur.next
        if cur is head: break

# Floyd 사이클 감지
def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast: return True
    return False`,
      javascript: `class Node { constructor(d){this.data=d;this.next=null;} }

// 순환 연결 리스트
const n1=new Node(10), n2=new Node(20), n3=new Node(30);
n1.next=n2; n2.next=n3; n3.next=n1; // 순환!

// 순회
function traverse(head) {
  if (!head) return;
  let cur = head;
  do { console.log(cur.data); cur = cur.next; } while (cur !== head);
}

// Floyd 사이클 감지
function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next; fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
      java: `class Node {
    int data; Node next;
    Node(int d) { data = d; }
}

// Floyd 사이클 감지 — 느린·빠른 포인터
static boolean hasCycle(Node head) {
    Node slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}

// 순환 리스트 생성: n1 → n2 → n3 → n1
Node n1 = new Node(10), n2 = new Node(20), n3 = new Node(30);
n1.next = n2; n2.next = n3; n3.next = n1;  // 순환!
System.out.println(hasCycle(n1));          // true`,
      cpp: `#include <iostream>

struct Node {
    int data;
    Node* next = nullptr;
    Node(int d) : data(d) {}
};

// Floyd 사이클 감지 — 느린·빠른 포인터
bool hasCycle(Node* head) {
    Node *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return true;
    }
    return false;
}

int main() {
    Node* n1 = new Node(10);
    Node* n2 = new Node(20);
    Node* n3 = new Node(30);
    n1->next = n2; n2->next = n3; n3->next = n1;  // 순환!
    std::cout << hasCycle(n1);  // 1
}`,
      csharp: `class Node {
    public int Data;
    public Node Next;
    public Node(int d) => Data = d;
}

// Floyd 사이클 감지 — 느린·빠른 포인터
bool HasCycle(Node head) {
    Node slow = head, fast = head;
    while (fast != null && fast.Next != null) {
        slow = slow.Next;
        fast = fast.Next.Next;
        if (slow == fast) return true;
    }
    return false;
}

// 순환 리스트 생성: n1 → n2 → n3 → n1
var n1 = new Node(10);
var n2 = new Node(20);
var n3 = new Node(30);
n1.Next = n2; n2.Next = n3; n3.Next = n1;  // 순환!
Console.WriteLine(HasCycle(n1));           // True`,
    },
    useCases: [
      { name: '라운드로빈 스케줄러', desc: '프로세스를 원형으로 이어 타임 퀀텀마다 다음 프로세스로 공정하게 넘깁니다.' },
      { name: '원형 버퍼 (Ring Buffer)', desc: '고정 크기 배열의 끝과 앞을 이어 오래된 데이터를 덮어쓰며 재사용합니다.' },
      { name: '게임 턴 순번', desc: '마지막 플레이어 다음이 다시 첫 플레이어가 되도록 순번을 순환시킵니다.' },
      { name: '반복 재생', desc: '마지막 곡의 next가 첫 곡을 가리켜 재생 목록을 끝없이 돌립니다.' },
    ],
    useCaseExample: {
      title: '보드게임 턴 순환',
      desc: '마지막 플레이어의 next가 첫 플레이어를 가리켜, 턴이 한 바퀴 돌면 별도 처리 없이 자연스럽게 처음으로 돌아옵니다.',
      code: `class Player:
    def __init__(self, name):
        self.name = name
        self.next = None

# 3명을 순환 연결: A → B → C → A
a, b, c = Player("A"), Player("B"), Player("C")
a.next, b.next, c.next = b, c, a

# 7턴 진행 — 순번이 자동으로 돈다
cur = a
for turn in range(1, 8):
    print(f"{turn}턴: {cur.name}")
    cur = cur.next`,
    },
  },

  // ── 트리 ─────────────────────────────────────────────────────
  {
    id: 'tree', name: '트리', subtitle: 'Tree',
    emoji: '🌳', color: '#16a34a', category: 'tree',
    tagline: '계층적 부모-자식 관계를 표현하는 비선형 자료구조',
    concept: [
      '**트리(Tree)**는 노드(Node)와 간선(Edge)으로 구성된 계층적 자료구조로, 루트(Root)가 하나 존재하고 모든 노드는 유일한 경로로 연결됩니다.',
      '각 노드는 0개 이상의 자식을 가지며, 사이클(Cycle)이 없는 연결 그래프입니다.',
      '파일 시스템, HTML DOM, 조직도처럼 계층적 데이터를 자연스럽게 모델링합니다.',
    ],
    keyPoints: [
      'n개 노드 → 정확히 n−1개의 간선',
      '높이 = 트리의 최대 레벨 (루트 = 레벨 1)',
      '이진 트리: 자식이 최대 2개 (차수 ≤ 2)',
      '순회: 전위 · 중위 · 후위 · 레벨',
    ],
    terminology: [
      { term: '루트(Root)', def: '부모가 없는 최상위 노드' },
      { term: '단말 노드(Leaf)', def: '자식이 없는 노드 — 리프 노드라고도 함' },
      { term: '비단말 노드', def: '자식을 하나 이상 가지는 노드' },
      { term: '레벨(Level)', def: '트리 각 층의 번호 — 루트가 레벨 1, 아래로 +1' },
      { term: '높이(Height)', def: '트리의 최대 레벨 — 루트만 있는 트리의 높이는 1' },
      { term: '차수(Degree)', def: '한 노드가 가지는 자식 노드의 수' },
      { term: '조상 / 자손', def: '루트 쪽 경로상의 노드 / 어떤 노드 아래의 모든 노드' },
      { term: '서브트리(Subtree)', def: '한 노드와 그 자손들로 이루어진 부분 트리' },
    ],
    adt: {
      description: '트리 ADT — 계층 구조 관리',
      operations: [
        { sig: 'root()', desc: '루트 노드 반환', complexity: 'O(1)' },
        { sig: 'parent(v)', desc: '노드 v의 부모 반환', complexity: 'O(1)' },
        { sig: 'children(v)', desc: '노드 v의 자식 목록 반환', complexity: 'O(d)' },
        { sig: 'isLeaf(v)', desc: '자식이 없으면 true', complexity: 'O(1)' },
        { sig: 'level(v)', desc: '루트에서 v까지의 레벨 반환', complexity: 'O(h)' },
        { sig: 'height()', desc: '트리의 최대 높이', complexity: 'O(n)' },
        { sig: 'size()', desc: '전체 노드 수', complexity: 'O(n)' },
      ],
    },
    complexity: [
      { op: '탐색 (균형)', avg: 'O(log n)', worst: 'O(n)', note: '균형 이진 트리 기준' },
      { op: '삽입 (균형)', avg: 'O(log n)', worst: 'O(n)', note: '경로 길이 = 높이' },
      { op: '순회', avg: 'O(n)', worst: 'O(n)', note: '모든 노드 방문' },
      { op: '높이 계산', avg: 'O(n)', worst: 'O(n)', note: '모든 노드를 한 번씩 방문' },
    ],
    representation: [
      { title: '배열 표현 (이진 트리)', desc: '노드 i의 왼쪽 자식=2i, 오른쪽=2i+1, 부모=i//2. 완전 이진 트리에 최적' },
      { title: '연결 리스트 표현', desc: '각 노드에 left/right/parent 포인터. 일반 트리에 범용적' },
    ],
    properties: [
      'n개 노드의 트리에는 정확히 n−1개의 간선이 있음',
      '이진 트리 레벨 i에는 최대 2^(i−1)개의 노드',
      '높이 h인 이진 트리의 최대 노드 수 = 2^h − 1 (높이 = 레벨 수)',
      'n개 노드 이진 트리의 높이: 최선 ⌈log₂(n+1)⌉ ~ 최악 n',
      '수식 트리: 비단말 노드는 연산자, 단말 노드는 피연산자 — 후위 순회로 계산',
      '완전 이진 트리는 배열 표현이 최적',
    ],
    classification: [
      { name: '이진 트리', desc: '자식 최대 2개 — BST, 힙의 기반' },
      { name: '완전 이진 트리', desc: '마지막 레벨 왼쪽부터 채움 — 힙 구현에 사용' },
      { name: '포화 이진 트리', desc: '모든 레벨이 꽉 참 — 이론적 최대 노드' },
      { name: '균형 이진 트리', desc: 'AVL · Red-Black — 높이 O(log n) 보장' },
      { name: '힙(Heap)', desc: '완전 이진 트리 + heap property — 우선순위 큐' },
    ],
    code: {
      python: `class Node:
    def __init__(self, val):
        self.val = val
        self.left = self.right = None

root = Node(1)
root.left = Node(2); root.right = Node(3)
root.left.left = Node(4); root.left.right = Node(5)

# 전위 순회: 루트 → 왼쪽 → 오른쪽
def preorder(node):
    if not node: return
    print(node.val, end=' ')   # 1 2 4 5 3
    preorder(node.left); preorder(node.right)

# 중위 순회: 왼쪽 → 루트 → 오른쪽
def inorder(node):
    if not node: return
    inorder(node.left); print(node.val, end=' '); inorder(node.right)

# 후위 순회: 왼쪽 → 오른쪽 → 루트
def postorder(node):
    if not node: return
    postorder(node.left); postorder(node.right); print(node.val, end=' ')

# 레벨 순서 순회 (BFS)
from collections import deque
def level_order(root):
    q = deque([root])
    while q:
        node = q.popleft()
        print(node.val, end=' ')
        if node.left: q.append(node.left)
        if node.right: q.append(node.right)`,
      javascript: `class Node { constructor(v){this.val=v;this.left=this.right=null;} }

const root = new Node(1);
root.left=new Node(2); root.right=new Node(3);
root.left.left=new Node(4); root.left.right=new Node(5);

// 전위: 루트→왼→오
const preorder  = n => n && (console.log(n.val), preorder(n.left),  preorder(n.right));
// 중위: 왼→루트→오
const inorder   = n => n && (inorder(n.left),   console.log(n.val), inorder(n.right));
// 후위: 왼→오→루트
const postorder = n => n && (postorder(n.left),  postorder(n.right), console.log(n.val));

// 레벨 순서 (BFS)
function levelOrder(root) {
  const q = [root];
  while (q.length) {
    const n = q.shift();
    console.log(n.val);
    if (n.left)  q.push(n.left);
    if (n.right) q.push(n.right);
  }
}`,
      java: `import java.util.LinkedList;
import java.util.Queue;

class Node {
    int val; Node left, right;
    Node(int v) { val = v; }
}

// 전위 순회: 루트 → 왼 → 오
static void preorder(Node n) {
    if (n == null) return;
    System.out.print(n.val + " ");   // 1 2 4 5 3
    preorder(n.left);
    preorder(n.right);
}

// 레벨 순서 순회 (BFS)
static void levelOrder(Node root) {
    Queue<Node> q = new LinkedList<>();
    q.offer(root);
    while (!q.isEmpty()) {
        Node n = q.poll();
        System.out.print(n.val + " ");
        if (n.left != null)  q.offer(n.left);
        if (n.right != null) q.offer(n.right);
    }
}`,
      cpp: `#include <queue>
#include <iostream>

struct Node {
    int val;
    Node *left = nullptr, *right = nullptr;
    Node(int v) : val(v) {}
};

// 전위 순회: 루트 → 왼 → 오
void preorder(Node* n) {
    if (!n) return;
    std::cout << n->val << ' ';   // 1 2 4 5 3
    preorder(n->left);
    preorder(n->right);
}

// 레벨 순서 순회 (BFS)
void levelOrder(Node* root) {
    std::queue<Node*> q;
    q.push(root);
    while (!q.empty()) {
        Node* n = q.front(); q.pop();
        std::cout << n->val << ' ';
        if (n->left)  q.push(n->left);
        if (n->right) q.push(n->right);
    }
}`,
      csharp: `class Node {
    public int Val;
    public Node Left, Right;
    public Node(int v) => Val = v;
}

// 전위 순회: 루트 → 왼 → 오
void Preorder(Node n) {
    if (n == null) return;
    Console.Write(n.Val + " ");   // 1 2 4 5 3
    Preorder(n.Left);
    Preorder(n.Right);
}

// 레벨 순서 순회 (BFS)
void LevelOrder(Node root) {
    var q = new Queue<Node>();
    q.Enqueue(root);
    while (q.Count > 0) {
        var n = q.Dequeue();
        Console.Write(n.Val + " ");
        if (n.Left != null)  q.Enqueue(n.Left);
        if (n.Right != null) q.Enqueue(n.Right);
    }
}`,
    },
    useCases: [
      { name: '파일 시스템', desc: '폴더가 하위 폴더·파일을 자식으로 갖는 전형적인 트리 계층입니다.' },
      { name: 'HTML DOM 트리', desc: '웹 페이지의 모든 태그가 부모-자식으로 이어진 트리로 표현됩니다.' },
      { name: '구문 분석 트리', desc: '컴파일러가 코드를 파싱해 연산 우선순위를 트리 구조에 담습니다.' },
      { name: '조직도·카테고리', desc: '회사 조직도·상품 분류처럼 계층적 데이터를 자연스럽게 모델링합니다.' },
    ],
    useCaseExample: {
      title: '폴더 용량 합산',
      desc: '폴더 트리를 **후위 순회**하면 자식(파일·하위 폴더)의 크기를 먼저 모두 더한 뒤 부모 폴더의 총 용량을 구할 수 있습니다.',
      code: `folder = {
    "name": "project", "size": 0,
    "children": [
        {"name": "main.py", "size": 12, "children": []},
        {"name": "src", "size": 0, "children": [
            {"name": "util.py", "size": 8,  "children": []},
            {"name": "app.py",  "size": 20, "children": []},
        ]},
    ],
}

def total_size(node):                    # 후위 순회
    return node["size"] + sum(total_size(c) for c in node["children"])

print(total_size(folder))   # 40`,
    },
  },

  // ── BST ──────────────────────────────────────────────────────
  {
    id: 'bst', name: '이진 탐색 트리', subtitle: 'Binary Search Tree',
    emoji: '🔍', color: '#8b5cf6', category: 'tree',
    tagline: '정렬 구조를 유지하며 평균 O(log n)으로 탐색',
    concept: [
      '**이진 탐색 트리(BST)**는 모든 노드에 대해 왼쪽 서브트리 < 현재 노드 < 오른쪽 서브트리 규칙을 만족합니다.',
      '이 규칙 덕분에 탐색마다 범위가 절반으로 줄어 균형 트리에서 O(log n)이 됩니다.',
      '삽입 순서에 따라 편향 트리(skewed tree)가 되면 최악 O(n) → AVL·Red-Black 트리가 이를 해결합니다.',
    ],
    keyPoints: [
      '왼쪽 < 부모 < 오른쪽 규칙 (모든 서브트리에 재귀 적용)',
      '중위 순회(in-order) → 오름차순 정렬',
      '균형 트리 높이 O(log n), 편향 최악 O(n)',
      'AVL: 회전(rotation)으로 편향을 막아 높이 O(log n) 유지',
      '삭제: 후계자(in-order successor) 교체',
    ],
    terminology: [
      { term: '편향 트리(Skewed)', def: '한쪽으로만 자식이 이어진 트리 — 최악 O(n)' },
      { term: '회전(Rotation)', def: '부모-자식 링크를 바꿔 트리 높이를 줄이는 연산 — 단순 회전(LL/RR)·이중 회전(LR/RL)' },
      { term: '균형 인수', def: '왼쪽 높이 − 오른쪽 높이 (AVL은 -1~1 유지)' },
      { term: '전임자(Predecessor)', def: '중위 순회 기준 바로 앞 노드 — 왼쪽 서브트리의 최댓값' },
      { term: '후계자(Successor)', def: '중위 순회 기준 바로 뒤 노드 — 오른쪽 서브트리의 최솟값' },
    ],
    adt: {
      description: 'BST ADT',
      operations: [
        { sig: 'insert(x)', desc: '값 x 삽입 (규칙 유지)', complexity: 'O(log n) avg' },
        { sig: 'search(x)', desc: '값 x 탐색', complexity: 'O(log n) avg' },
        { sig: 'delete(x)', desc: '값 x 삭제 (후계자 교체)', complexity: 'O(log n) avg' },
        { sig: 'min()', desc: '최솟값 반환 (맨 왼쪽)', complexity: 'O(log n)' },
        { sig: 'max()', desc: '최댓값 반환 (맨 오른쪽)', complexity: 'O(log n)' },
      ],
    },
    complexity: [
      { op: '탐색', avg: 'O(log n)', worst: 'O(n)', note: '균형 트리 vs. 편향 트리' },
      { op: '삽입', avg: 'O(log n)', worst: 'O(n)', note: '탐색 후 빈 자리에 삽입' },
      { op: '삭제', avg: 'O(log n)', worst: 'O(n)', note: '후계자 탐색 후 교체' },
      { op: '최솟값/최댓값', avg: 'O(log n)', worst: 'O(n)', note: '맨 왼쪽/오른쪽 노드' },
    ],
    representation: [
      { title: '연결 표현', desc: 'class Node { val, left, right } — 일반적 구현' },
      { title: '배열 표현', desc: '완전 이진 트리일 때만 효율적 (힙에서 사용)' },
    ],
    properties: [
      '중위 순회 결과는 항상 오름차순 정렬',
      '1, 2, 3, 4, 5 순서 삽입 → 오른쪽으로만 편향 → 연결 리스트와 동일',
      'AVL 트리: 모든 노드의 균형 인수(왼쪽 높이 − 오른쪽 높이)가 ±1 이하',
      'AVL 불균형 4가지: LL · RR(단순 회전), LR · RL(이중 회전)으로 재균형',
    ],
    code: {
      python: `# AVL 트리 — BST 삽입 + 회전으로 균형 유지
class Node:
    def __init__(self, val):
        self.val = val
        self.left = self.right = None
        self.height = 1

def h(n):   return n.height if n else 0
def bf(n):  return h(n.left) - h(n.right) if n else 0   # 균형 인수
def upd(n): n.height = 1 + max(h(n.left), h(n.right))

def rotate_right(y):          # LL 불균형 해소 (단순 회전)
    x = y.left
    y.left = x.right
    x.right = y
    upd(y); upd(x)
    return x

def rotate_left(x):           # RR 불균형 해소 (단순 회전)
    y = x.right
    x.right = y.left
    y.left = x
    upd(x); upd(y)
    return y

def insert(node, val):        # AVL 삽입 = BST 삽입 + 재균형
    if not node: return Node(val)
    if val < node.val:   node.left  = insert(node.left, val)
    elif val > node.val: node.right = insert(node.right, val)
    else: return node
    upd(node)
    b = bf(node)
    if b > 1 and val < node.left.val:   return rotate_right(node)              # LL
    if b < -1 and val > node.right.val: return rotate_left(node)               # RR
    if b > 1 and val > node.left.val:                                         # LR
        node.left = rotate_left(node.left);   return rotate_right(node)
    if b < -1 and val < node.right.val:                                       # RL
        node.right = rotate_right(node.right); return rotate_left(node)
    return node`,
      javascript: `// AVL 트리 — BST 삽입 + 회전으로 균형 유지
class Node {
  constructor(v){ this.val=v; this.left=this.right=null; this.h=1; }
}
const h   = n => n ? n.h : 0;
const bf  = n => n ? h(n.left) - h(n.right) : 0;   // 균형 인수
const upd = n => { n.h = 1 + Math.max(h(n.left), h(n.right)); };

function rotateRight(y){        // LL 불균형 해소
  const x = y.left;
  y.left = x.right;  x.right = y;
  upd(y); upd(x);
  return x;
}
function rotateLeft(x){         // RR 불균형 해소
  const y = x.right;
  x.right = y.left;  y.left = x;
  upd(x); upd(y);
  return y;
}
function insert(node, val){     // AVL 삽입 = BST 삽입 + 재균형
  if(!node) return new Node(val);
  if(val < node.val)      node.left  = insert(node.left, val);
  else if(val > node.val) node.right = insert(node.right, val);
  else return node;
  upd(node);
  const b = bf(node);
  if(b>1  && val < node.left.val)  return rotateRight(node);                  // LL
  if(b<-1 && val > node.right.val) return rotateLeft(node);                   // RR
  if(b>1  && val > node.left.val){      // LR
    node.left = rotateLeft(node.left);  return rotateRight(node); }
  if(b<-1 && val < node.right.val){     // RL
    node.right = rotateRight(node.right); return rotateLeft(node); }
  return node;
}`,
      java: `class Node {
    int val; Node left, right;
    Node(int v) { val = v; }
}

// BST 삽입 — 왼쪽 < 부모 < 오른쪽 규칙 유지
static Node insert(Node node, int val) {
    if (node == null) return new Node(val);
    if (val < node.val)      node.left  = insert(node.left, val);
    else if (val > node.val) node.right = insert(node.right, val);
    return node;
}

// BST 탐색 — 평균 O(log n)
static boolean search(Node node, int val) {
    if (node == null) return false;
    if (val == node.val) return true;
    return val < node.val ? search(node.left, val)
                          : search(node.right, val);
}

// 중위 순회 → 오름차순 정렬
static void inorder(Node n) {
    if (n == null) return;
    inorder(n.left);
    System.out.print(n.val + " ");
    inorder(n.right);
}`,
      cpp: `#include <iostream>

struct Node {
    int val;
    Node *left = nullptr, *right = nullptr;
    Node(int v) : val(v) {}
};

// BST 삽입 — 왼쪽 < 부모 < 오른쪽 규칙 유지
Node* insert(Node* node, int val) {
    if (!node) return new Node(val);
    if (val < node->val)      node->left  = insert(node->left, val);
    else if (val > node->val) node->right = insert(node->right, val);
    return node;
}

// BST 탐색 — 평균 O(log n)
bool search(Node* node, int val) {
    if (!node) return false;
    if (val == node->val) return true;
    return val < node->val ? search(node->left, val)
                           : search(node->right, val);
}

// 중위 순회 → 오름차순 정렬
void inorder(Node* n) {
    if (!n) return;
    inorder(n->left);
    std::cout << n->val << ' ';
    inorder(n->right);
}`,
      csharp: `class Node {
    public int Val;
    public Node Left, Right;
    public Node(int v) => Val = v;
}

// BST 삽입 — 왼쪽 < 부모 < 오른쪽 규칙 유지
Node Insert(Node node, int val) {
    if (node == null) return new Node(val);
    if (val < node.Val)      node.Left  = Insert(node.Left, val);
    else if (val > node.Val) node.Right = Insert(node.Right, val);
    return node;
}

// BST 탐색 — 평균 O(log n)
bool Search(Node node, int val) {
    if (node == null) return false;
    if (val == node.Val) return true;
    return val < node.Val ? Search(node.Left, val)
                          : Search(node.Right, val);
}

// 중위 순회 → 오름차순 정렬
void Inorder(Node n) {
    if (n == null) return;
    Inorder(n.Left);
    Console.Write(n.Val + " ");
    Inorder(n.Right);
}`,
    },
    useCases: [
      { name: 'DB 인덱스', desc: '데이터베이스는 B-Tree(BST의 확장)로 키를 정렬 보관해 빠른 검색을 지원합니다.' },
      { name: '순서 있는 집합·맵', desc: 'Java TreeMap·C++ std::map은 균형 BST라 키가 항상 정렬되어 있습니다.' },
      { name: '범위 질의', desc: '"30~70 사이 값"처럼 정렬 구조를 활용한 범위 탐색이 빠릅니다.' },
      { name: '자동완성·사전', desc: '정렬된 키 위에서 특정 접두사·구간을 효율적으로 좁혀 나갑니다.' },
    ],
    useCaseExample: {
      title: '점수 순위 검색',
      desc: 'BST에 점수를 삽입하면 **중위 순회**만으로 정렬된 결과를 얻고, 특정 점수 탐색도 균형 트리에서 평균 O(log n)입니다.',
      code: `class Node:
    def __init__(self, v): self.v = v; self.left = self.right = None

def insert(root, v):
    if not root: return Node(v)
    if v < root.v: root.left  = insert(root.left, v)
    else:          root.right = insert(root.right, v)
    return root

root = None
for score in [82, 95, 70, 88, 100]:
    root = insert(root, score)

def inorder(n):                      # 중위 순회 → 오름차순
    if n: inorder(n.left); print(n.v, end=" "); inorder(n.right)

inorder(root)   # 70 82 88 95 100`,
    },
  },

  // ── 우선순위 큐 ──────────────────────────────────────────────
  {
    id: 'priorityqueue', name: '우선순위 큐', subtitle: 'Priority Queue (Heap)',
    emoji: '🏆', color: '#f97316', category: 'tree',
    tagline: '우선순위가 높은 원소가 먼저 나오는 큐 — 힙으로 구현',
    concept: [
      '**우선순위 큐(Priority Queue)**는 각 원소에 우선순위가 있어 가장 높은(또는 낮은) 우선순위를 가진 원소가 먼저 제거됩니다.',
      '**힙(Heap)**은 완전 이진 트리 + heap property(부모 ≥ 자식 for Max-Heap)를 만족하며 우선순위 큐의 표준 구현입니다.',
      '배열 기반 힙은 인덱스 관계(부모=i//2, 왼쪽=2i, 오른쪽=2i+1)를 이용해 포인터 없이 트리를 표현합니다.',
    ],
    keyPoints: [
      'Max-Heap: 부모 ≥ 자식 → 루트가 최댓값',
      'Min-Heap: 부모 ≤ 자식 → 루트가 최솟값',
      '삽입 후 heapify-up, 삭제 후 heapify-down',
      '배열 인덱스 — 1-based: parent=i//2, left=2i, right=2i+1 / 0-based: parent=(i−1)//2, left=2i+1, right=2i+2',
    ],
    terminology: [
      { term: 'Heap Property', def: 'Max-Heap: 모든 부모 ≥ 자식. Min-Heap: 모든 부모 ≤ 자식' },
      { term: 'Heapify-Up (Upheap)', def: '삽입 후 부모와 비교하며 올라가 heap property 복구' },
      { term: 'Heapify-Down (Downheap)', def: '루트 삭제 후 자식과 비교하며 내려가 heap property 복구' },
      { term: 'Heapify', def: '임의 배열을 힙으로 변환 — O(n)에 수행 가능' },
      { term: '힙 정렬', def: 'Max-Heap 구성 후 루트를 반복 추출 → 정렬 O(n log n)' },
    ],
    adt: {
      description: '우선순위 큐 ADT',
      operations: [
        { sig: 'insert(x)', desc: '원소 x 삽입 (heapify-up)', complexity: 'O(log n)' },
        { sig: 'extractMax()', desc: '최댓값 제거 후 반환 (heapify-down)', complexity: 'O(log n)' },
        { sig: 'findMax()', desc: '최댓값 확인 (루트)', complexity: 'O(1)' },
        { sig: 'isEmpty()', desc: '비어있으면 true', complexity: 'O(1)' },
        { sig: 'heapify(arr)', desc: '배열을 힙으로 변환', complexity: 'O(n)' },
      ],
    },
    complexity: [
      { op: '삽입', avg: 'O(log n)', worst: 'O(log n)', note: '최대 높이만큼 heapify-up' },
      { op: 'extractMax/Min', avg: 'O(log n)', worst: 'O(log n)', note: '높이만큼 heapify-down' },
      { op: 'findMax/Min', avg: 'O(1)', worst: 'O(1)', note: '루트 = 항상 최댓/최솟값' },
      { op: 'heapify(배열)', avg: 'O(n)', worst: 'O(n)', note: '하향식 heapify' },
    ],
    representation: [
      { title: '배열 표현 (표준)', desc: '1-based: heap[1]=루트, heap[i]의 왼쪽=heap[2i], 오른쪽=heap[2i+1]' },
      { title: '피보나치 힙', desc: '이론적으로 삽입 O(1), extractMin O(log n) — Dijkstra 최적화에 사용' },
    ],
    properties: [
      '완전 이진 트리이므로 높이 = ⌊log₂ n⌋ + 1 — 즉 O(log n)',
      '삽입·삭제는 O(log n) — 높이에 비례',
      '배열 n개를 힙으로 만들기: O(n) (바닥부터 heapify-down)',
    ],
    code: {
      python: `import heapq  # Python = Min-Heap 기본

heap = []
heapq.heappush(heap, 30)
heapq.heappush(heap, 10)
heapq.heappush(heap, 50)
heapq.heappush(heap, 20)

print(heap[0])              # 10 (최솟값)
print(heapq.heappop(heap))  # 10
print(heapq.heappop(heap))  # 20

# Max-Heap: 값에 음수 붙이기
heapq.heappush(heap, -50)
max_val = -heapq.heappop(heap)  # 50

# 배열 → 힙 변환 O(n)
arr = [3,1,4,1,5,9,2,6]
heapq.heapify(arr)`,
      javascript: `// JS 내장 힙 없음 → 직접 구현
class MinHeap {
  #h = [null]; // 1-based
  push(v) {
    this.#h.push(v);
    let i = this.#h.length - 1;
    while (i > 1 && this.#h[i] < this.#h[Math.floor(i/2)]) {
      [this.#h[i], this.#h[Math.floor(i/2)]] = [this.#h[Math.floor(i/2)], this.#h[i]];
      i = Math.floor(i/2);
    }
  }
  pop() {
    if (this.#h.length <= 1) return null;
    const min = this.#h[1];
    this.#h[1] = this.#h.pop();
    let i = 1, n = this.#h.length;
    while (true) {
      let s = i, l = 2*i, r = 2*i+1;
      if (l < n && this.#h[l] < this.#h[s]) s = l;
      if (r < n && this.#h[r] < this.#h[s]) s = r;
      if (s === i) break;
      [this.#h[i], this.#h[s]] = [this.#h[s], this.#h[i]]; i = s;
    }
    return min;
  }
  peek() { return this.#h[1]; }
}`,
      java: `import java.util.Collections;
import java.util.PriorityQueue;

// Min-Heap (기본) — 루트가 최솟값
PriorityQueue<Integer> pq = new PriorityQueue<>();
pq.offer(30); pq.offer(10); pq.offer(50); pq.offer(20);

System.out.println(pq.peek());  // 10 (최솟값)
System.out.println(pq.poll());  // 10 — extractMin (heapify-down)
System.out.println(pq.poll());  // 20

// Max-Heap — reverseOrder 비교자
PriorityQueue<Integer> maxPq = new PriorityQueue<>(Collections.reverseOrder());
maxPq.offer(30); maxPq.offer(50); maxPq.offer(10);
System.out.println(maxPq.peek());  // 50`,
      cpp: `#include <queue>
#include <vector>
#include <iostream>

int main() {
    // Max-Heap (기본) — 루트가 최댓값
    std::priority_queue<int> maxHeap;
    maxHeap.push(30); maxHeap.push(10); maxHeap.push(50);
    std::cout << maxHeap.top();  // 50 (최댓값)
    maxHeap.pop();

    // Min-Heap — greater 비교자 지정
    std::priority_queue<int, std::vector<int>, std::greater<int>> minHeap;
    minHeap.push(30); minHeap.push(10); minHeap.push(50);
    std::cout << minHeap.top();  // 10 (최솟값)
}`,
      csharp: `// .NET 6+ PriorityQueue<TElement, TPriority> — Min-Heap
var pq = new PriorityQueue<string, int>();
pq.Enqueue("작업 A", 30);
pq.Enqueue("작업 B", 10);   // 우선순위 10 → 가장 먼저
pq.Enqueue("작업 C", 50);

Console.WriteLine(pq.Peek());     // 작업 B (제거 없음)
Console.WriteLine(pq.Dequeue());  // 작업 B — 최소 우선순위
Console.WriteLine(pq.Dequeue());  // 작업 A`,
    },
    useCases: [
      { name: '다익스트라 최단 경로', desc: '가장 가까운 정점을 매번 O(log n)에 꺼내 최단 경로를 확장합니다.' },
      { name: '힙 정렬', desc: '전체를 힙으로 만든 뒤 최댓값을 반복 추출하면 O(n log n) 정렬이 됩니다.' },
      { name: '작업 스케줄링', desc: '우선순위가 높은 작업을 먼저 꺼내 처리합니다 — OS·메시지 큐.' },
      { name: 'A* 길찾기', desc: '예상 비용이 낮은 경로를 우선순위 큐에서 먼저 꺼내 탐색합니다.' },
      { name: '실시간 중앙값', desc: '최대 힙·최소 힙을 함께 써서 스트림의 중앙값을 O(log n)에 유지합니다.' },
    ],
    useCaseExample: {
      title: '응급실 환자 분류 (Triage)',
      desc: '도착 순서와 무관하게 위급도가 높은(숫자가 작은) 환자를 먼저 진료하도록 우선순위 큐로 관리합니다.',
      code: `import heapq

er = []   # (위급도, 환자) — 숫자가 작을수록 위급
heapq.heappush(er, (3, "감기 환자"))
heapq.heappush(er, (1, "심정지 환자"))
heapq.heappush(er, (2, "골절 환자"))

while er:
    level, patient = heapq.heappop(er)
    print(f"진료: {patient} (위급도 {level})")
# 심정지 → 골절 → 감기 순서로 진료`,
    },
  },

  // ── 해시 테이블 ───────────────────────────────────────────────
  {
    id: 'hashtable', name: '해시 테이블', subtitle: 'Hash Table',
    emoji: '#️⃣', color: '#ef4444', category: 'hashgraph',
    tagline: '키를 해시 함수로 변환해 평균 O(1) 접근',
    concept: [
      '**키(Key)**를 해시 함수에 넣어 정수로 변환한 뒤, 그 값을 배열 인덱스로 사용해 데이터를 저장합니다.',
      '충돌(Collision)이 없으면 평균 O(1) 삽입·탐색·삭제가 가능합니다.',
      '충돌은 체이닝(Chaining) 또는 개방 주소법(Open Addressing)으로 해결합니다.',
    ],
    keyPoints: [
      'hash(key) % size → 배열 인덱스',
      '충돌 해결: 체이닝(연결 리스트) or 개방 주소법',
      '부하율(load factor) = 저장 수 / 배열 크기',
      '부하율 초과 시 리해싱(2배 확장)',
    ],
    terminology: [
      { term: '해시 함수', def: '임의의 키를 일정 범위의 정수로 변환하는 함수' },
      { term: '버킷(Bucket)', def: '같은 해시 값을 가진 원소들을 저장하는 슬롯' },
      { term: '충돌(Collision)', def: '서로 다른 키가 같은 해시 값으로 매핑되는 현상' },
      { term: '체이닝', def: '충돌 시 같은 버킷에 연결 리스트로 이어 저장' },
      { term: '개방 주소법', def: '충돌 시 다음 빈 슬롯을 찾아 저장 (선형·이차·이중 해싱)' },
      { term: '부하율(Load Factor)', def: '저장된 원소 수 / 배열 크기. 높을수록 충돌 증가' },
      { term: '리해싱(Rehashing)', def: '부하율 초과 시 배열을 2배로 늘리고 전체 재삽입' },
    ],
    adt: {
      description: '해시 테이블(맵) ADT',
      operations: [
        { sig: 'put(key, value)', desc: '키-값 쌍 삽입', complexity: 'O(1) avg' },
        { sig: 'get(key)', desc: '키에 해당하는 값 반환', complexity: 'O(1) avg' },
        { sig: 'remove(key)', desc: '키-값 쌍 삭제', complexity: 'O(1) avg' },
        { sig: 'containsKey(key)', desc: '키 존재 여부 확인', complexity: 'O(1) avg' },
        { sig: 'keys()', desc: '모든 키 반환', complexity: 'O(n)' },
      ],
    },
    complexity: [
      { op: '삽입', avg: 'O(1)', worst: 'O(n)', note: '충돌 없으면 O(1)' },
      { op: '탐색', avg: 'O(1)', worst: 'O(n)', note: '모든 키가 같은 버킷이면 O(n)' },
      { op: '삭제', avg: 'O(1)', worst: 'O(n)', note: '찾은 후 제거' },
    ],
    representation: [
      { title: '체이닝', desc: '각 버킷이 연결 리스트. 부하율 제한 없음, 포인터 오버헤드' },
      { title: '개방 주소법', desc: '배열 내에서 빈 슬롯 탐색. 캐시 효율↑, 부하율 70~75% 제한' },
    ],
    properties: [
      '좋은 해시 함수: 균등 분포, 빠른 계산, 결정론적',
      '부하율 α일 때 체이닝의 평균 탐색 시간 ≈ 1 + α/2',
      'Python dict는 개방 주소법(compact hash table), 부하율 2/3 이상 시 리해싱',
    ],
    code: {
      python: `d = {}
d['alice'] = 95; d['bob'] = 87; d['carol'] = 92

print(d['alice'])    # 95
print('bob' in d)    # True
del d['bob']

# 직접 구현 (체이닝)
class HashTable:
    def __init__(self, size=8):
        self.b = [[] for _ in range(size)]
    def _h(self, k): return hash(k) % len(self.b)
    def put(self, k, v):
        b = self.b[self._h(k)]
        for i,(ek,_) in enumerate(b):
            if ek == k: b[i]=(k,v); return
        b.append((k,v))
    def get(self, k):
        for ek,ev in self.b[self._h(k)]:
            if ek == k: return ev`,
      javascript: `const map = new Map();
map.set('alice', 95); map.set('bob', 87);
console.log(map.get('alice')); // 95
console.log(map.has('bob'));   // true
map.delete('bob');`,
      java: `import java.util.HashMap;

HashMap<String,Integer> map = new HashMap<>();
map.put("alice", 95); map.put("bob", 87); map.put("carol", 92);

System.out.println(map.get("alice"));        // 95
System.out.println(map.containsKey("bob"));  // true
map.remove("bob");

// 빈도 카운팅
String[] words = {"a", "b", "a", "c", "a"};
HashMap<String,Integer> freq = new HashMap<>();
for (String w : words)
    freq.merge(w, 1, Integer::sum);
System.out.println(freq.get("a"));  // 3`,
      cpp: `#include <unordered_map>
#include <string>
#include <iostream>

int main() {
    std::unordered_map<std::string,int> map;
    map["alice"] = 95; map["bob"] = 87; map["carol"] = 92;

    std::cout << map["alice"];      // 95
    std::cout << map.count("bob");  // 1 (키 존재)
    map.erase("bob");

    // 빈도 카운팅
    std::string words[] = {"a", "b", "a", "c", "a"};
    std::unordered_map<std::string,int> freq;
    for (auto& w : words) freq[w]++;
    std::cout << freq["a"];  // 3
}`,
      csharp: `var map = new Dictionary<string,int> {
    ["alice"] = 95, ["bob"] = 87, ["carol"] = 92
};

Console.WriteLine(map["alice"]);            // 95
Console.WriteLine(map.ContainsKey("bob"));  // True
map.Remove("bob");

// 빈도 카운팅
string[] words = { "a", "b", "a", "c", "a" };
var freq = new Dictionary<string,int>();
foreach (var w in words)
    freq[w] = freq.GetValueOrDefault(w) + 1;
Console.WriteLine(freq["a"]);  // 3`,
    },
    useCases: [
      { name: '표준 라이브러리 맵', desc: 'Python dict·Java HashMap·JS Map 모두 해시 테이블 구현체입니다.' },
      { name: '중복 검사·빈도 카운팅', desc: '키 존재 확인이 평균 O(1)이라 중복 탐지·개수 세기에 최적입니다.' },
      { name: 'DB 해시 인덱스', desc: '동등 조건 검색(WHERE id = ?)을 평균 O(1)에 처리하는 인덱스로 쓰입니다.' },
      { name: '캐시', desc: '키로 결과를 즉시 찾아 반복 계산·중복 요청을 건너뜁니다.' },
    ],
    useCaseExample: {
      title: '단어 빈도 세기',
      desc: '문장의 각 단어를 키로 두고 등장 횟수를 값으로 누적합니다. 키 접근이 O(1)이라 전체가 O(단어 수)에 끝납니다.',
      code: `text = "apple banana apple cherry banana apple"

freq = {}
for word in text.split():
    freq[word] = freq.get(word, 0) + 1   # 없으면 0에서 시작

for word, count in freq.items():
    print(f"{word}: {count}")
# apple: 3 / banana: 2 / cherry: 1`,
    },
  },

  // ── 그래프 ────────────────────────────────────────────────────
  {
    id: 'graph', name: '그래프', subtitle: 'Graph',
    emoji: '🕸', color: '#0891b2', category: 'hashgraph',
    tagline: '정점과 간선으로 임의의 관계를 표현하는 범용 자료구조',
    concept: [
      '**그래프 G = (V, E)**는 정점(Vertex) 집합 V와 간선(Edge) 집합 E로 구성된 자료구조입니다.',
      '트리는 그래프의 특수한 경우(비순환 연결 그래프)이며, 그래프는 사이클·비연결·자기 루프를 허용합니다.',
      'BFS와 DFS는 그래프의 모든 노드를 방문하는 가장 중요한 순회 알고리즘입니다.',
    ],
    keyPoints: [
      '무향 그래프: 간선에 방향 없음 (A-B = B-A)',
      '유향 그래프: 간선에 방향 있음 (A→B ≠ B→A)',
      '표현: 인접 행렬 O(V²) vs 인접 리스트 O(V+E)',
      'BFS: 최단 경로 / DFS: 사이클 감지·위상 정렬',
    ],
    terminology: [
      { term: '정점(Vertex)', def: '그래프의 노드, 개체를 표현' },
      { term: '간선(Edge)', def: '두 정점을 연결하는 선' },
      { term: '인접(Adjacent)', def: '두 정점이 간선으로 직접 연결된 상태' },
      { term: '차수(Degree)', def: '한 정점에 연결된 간선의 수. 유향에서는 진입차수/진출차수' },
      { term: '경로(Path)', def: '정점들의 순서열로 연속된 간선을 따라 이동하는 경로' },
      { term: '사이클(Cycle)', def: '출발 정점으로 돌아오는 경로' },
      { term: '연결 그래프', def: '임의의 두 정점 사이에 경로가 존재하는 그래프' },
      { term: '완전 그래프', def: '모든 정점 쌍이 간선으로 연결된 그래프 — 간선 수 n(n-1)/2' },
    ],
    adt: {
      description: '그래프 ADT',
      operations: [
        { sig: 'addVertex(v)', desc: '정점 v 추가', complexity: 'O(1)' },
        { sig: 'addEdge(u, v)', desc: '간선 (u,v) 추가', complexity: 'O(1)' },
        { sig: 'adjacent(v)', desc: 'v와 인접한 정점 목록', complexity: 'O(degree)' },
        { sig: 'BFS(start)', desc: '너비 우선 탐색', complexity: 'O(V+E)' },
        { sig: 'DFS(start)', desc: '깊이 우선 탐색', complexity: 'O(V+E)' },
      ],
    },
    complexity: [
      { op: '정점/간선 추가', avg: 'O(1)', worst: 'O(1)', note: '인접 리스트 기준' },
      { op: 'BFS / DFS', avg: 'O(V+E)', worst: 'O(V+E)', note: '모든 정점·간선 방문' },
      { op: '인접 정점 탐색', avg: 'O(V)', worst: 'O(V)', note: '인접 행렬: O(V), 리스트: O(degree)' },
    ],
    representation: [
      { title: '인접 행렬', desc: 'V×V 배열. adj[u][v]=1이면 연결. 탐색 O(1), 공간 O(V²) — 밀집 그래프' },
      { title: '인접 리스트', desc: '각 정점에 연결된 정점 목록. 공간 O(V+E) — 희소 그래프' },
    ],
    properties: [
      '무향 그래프: 모든 차수의 합 = 2|E|',
      '완전 그래프 K_n: 간선 수 = n(n-1)/2',
      'BFS 탐색 거리 = 최단 경로 (가중치 없을 때)',
      'DFS로 위상 정렬, 강연결요소(SCC) 탐색 가능',
    ],
    classification: [
      { name: '무향 그래프', desc: '간선에 방향 없음 — 소셜 네트워크 친구 관계' },
      { name: '유향 그래프(DAG)', desc: '간선에 방향 있음 — 작업 의존성, 위상 정렬' },
      { name: '연결 그래프', desc: '모든 정점 간 경로 존재' },
      { name: '이분 그래프', desc: '정점을 두 집합으로 나눌 수 있어 같은 집합 내 간선 없음' },
    ],
    code: {
      python: `from collections import deque, defaultdict

graph = defaultdict(list)
# 간선 추가 (무향)
for u, v in [(1,2),(1,3),(2,4),(3,4),(4,5)]:
    graph[u].append(v); graph[v].append(u)

# BFS — 최단 경로 탐색
def bfs(start):
    visited = {start}
    q = deque([start])
    while q:
        v = q.popleft()
        print(v, end=' ')
        for u in graph[v]:
            if u not in visited:
                visited.add(u); q.append(u)

# DFS — 재귀
def dfs(v, visited=None):
    if visited is None: visited = set()
    visited.add(v); print(v, end=' ')
    for u in graph[v]:
        if u not in visited: dfs(u, visited)`,
      javascript: `const graph = new Map();
const addEdge = (u,v) => {
  if(!graph.has(u))graph.set(u,[]);
  if(!graph.has(v))graph.set(v,[]);
  graph.get(u).push(v); graph.get(v).push(u);
};
[[1,2],[1,3],[2,4],[3,4],[4,5]].forEach(([u,v])=>addEdge(u,v));

// BFS
function bfs(start) {
  const vis=new Set([start]), q=[start];
  while(q.length){
    const v=q.shift(); console.log(v);
    for(const u of graph.get(v)||[])
      if(!vis.has(u)){vis.add(u);q.push(u);}
  }
}
// DFS
function dfs(v, vis=new Set()){
  vis.add(v); console.log(v);
  for(const u of graph.get(v)||[])
    if(!vis.has(u)) dfs(u,vis);
}`,
      java: `import java.util.*;

Map<Integer,List<Integer>> graph = new HashMap<>();
int[][] edges = {{1,2},{1,3},{2,4},{3,4},{4,5}};
for (int[] e : edges) {                            // 무향 간선
    graph.computeIfAbsent(e[0], k -> new ArrayList<>()).add(e[1]);
    graph.computeIfAbsent(e[1], k -> new ArrayList<>()).add(e[0]);
}

// BFS — 너비 우선
static void bfs(Map<Integer,List<Integer>> g, int start) {
    Set<Integer> visited = new HashSet<>(Set.of(start));
    Queue<Integer> q = new LinkedList<>(List.of(start));
    while (!q.isEmpty()) {
        int v = q.poll();
        System.out.print(v + " ");
        for (int u : g.getOrDefault(v, List.of()))
            if (visited.add(u)) q.offer(u);
    }
}

// DFS — 깊이 우선 (재귀)
static void dfs(Map<Integer,List<Integer>> g, int v, Set<Integer> vis) {
    vis.add(v);
    System.out.print(v + " ");
    for (int u : g.getOrDefault(v, List.of()))
        if (!vis.contains(u)) dfs(g, u, vis);
}`,
      cpp: `#include <vector>
#include <queue>
#include <set>
#include <iostream>

std::vector<int> graph[6];   // 인접 리스트 (정점 1~5)

void addEdge(int u, int v) { // 무향 간선
    graph[u].push_back(v);
    graph[v].push_back(u);
}

// BFS — 너비 우선
void bfs(int start) {
    std::set<int> visited{start};
    std::queue<int> q;
    q.push(start);
    while (!q.empty()) {
        int v = q.front(); q.pop();
        std::cout << v << ' ';
        for (int u : graph[v])
            if (visited.insert(u).second) q.push(u);
    }
}

// DFS — 깊이 우선 (재귀)
void dfs(int v, std::set<int>& vis) {
    vis.insert(v);
    std::cout << v << ' ';
    for (int u : graph[v])
        if (!vis.count(u)) dfs(u, vis);
}`,
      csharp: `var graph = new Dictionary<int,List<int>>();
void AddEdge(int u, int v) {          // 무향 간선
    if (!graph.ContainsKey(u)) graph[u] = new List<int>();
    if (!graph.ContainsKey(v)) graph[v] = new List<int>();
    graph[u].Add(v); graph[v].Add(u);
}
foreach (var (u, v) in new[] { (1,2), (1,3), (2,4), (3,4), (4,5) })
    AddEdge(u, v);

// BFS — 너비 우선
void Bfs(int start) {
    var visited = new HashSet<int> { start };
    var q = new Queue<int>();
    q.Enqueue(start);
    while (q.Count > 0) {
        int v = q.Dequeue();
        Console.Write(v + " ");
        foreach (int u in graph[v])
            if (visited.Add(u)) q.Enqueue(u);
    }
}

// DFS — 깊이 우선 (재귀)
void Dfs(int v, HashSet<int> vis) {
    vis.Add(v);
    Console.Write(v + " ");
    foreach (int u in graph[v])
        if (!vis.Contains(u)) Dfs(u, vis);
}`,
    },
    useCases: [
      { name: '소셜 네트워크', desc: '사람을 정점, 친구 관계를 간선으로 두어 친구 추천·관계 탐색을 합니다.' },
      { name: '지도·경로 탐색', desc: '교차로를 정점, 도로를 간선으로 모델링해 경로를 찾습니다.' },
      { name: '웹 크롤링', desc: '페이지를 정점, 링크를 간선으로 보고 BFS·DFS로 사이트를 순회합니다.' },
      { name: '의존성 분석', desc: '모듈 간 import 관계를 유향 그래프로 두고 빌드·실행 순서를 정합니다.' },
    ],
    useCaseExample: {
      title: '친구의 친구 추천',
      desc: '소셜 그래프에서 **BFS**로 거리가 2인 사람(친구의 친구)을 찾아, 나와 직접 친구가 아닌 사람을 추천합니다.',
      code: `from collections import deque

friends = {
    "나":   ["민수", "지영"],
    "민수": ["나", "철수"],
    "지영": ["나", "영희"],
    "철수": ["민수"], "영희": ["지영"],
}

def recommend(start):
    visited = {start}
    q = deque([(start, 0)])
    rec = []
    while q:
        person, dist = q.popleft()
        if dist == 2: rec.append(person)        # 거리 2 = 추천 대상
        for f in friends[person]:
            if f not in visited:
                visited.add(f); q.append((f, dist + 1))
    return rec

print(recommend("나"))   # ['철수', '영희']`,
    },
  },

  // ── 가중치 그래프 ─────────────────────────────────────────────
  {
    id: 'weightedgraph', name: '가중치 그래프', subtitle: 'Weighted Graph',
    emoji: '⚖️', color: '#d97706', category: 'hashgraph',
    tagline: '간선에 비용(거리·시간)이 있는 그래프 — 최단 경로·MST',
    concept: [
      '**가중치 그래프**는 각 간선에 숫자(가중치)가 부여된 그래프입니다. 비용·거리·시간 등을 표현합니다.',
      '**최단 경로**는 Dijkstra(단일 출발·음수 불가)·Bellman-Ford(음수 허용)·Floyd(모든 정점 쌍, O(V³))로 구합니다.',
      '**최소 신장 트리(MST)**: Kruskal(간선 정렬 O(E log E)), Prim(O((V+E) log V))',
    ],
    keyPoints: [
      'Dijkstra: 단일 출발 최단 경로 — 음수 가중치 불가',
      'Bellman-Ford: 음수 가중치 허용 — 음수 사이클 감지',
      'Floyd: 모든 정점 쌍 최단 경로 — 3중 반복 O(V³)',
      'MST: 사이클 없이 모든 정점을 잇는 최소 비용 트리',
      'Kruskal(간선 정렬+Union-Find) / Prim(정점 확장)',
    ],
    terminology: [
      { term: '가중치(Weight)', def: '간선에 부여된 비용·거리·시간 등의 수치' },
      { term: '최단 경로', def: '두 정점 사이 간선 가중치 합이 최소인 경로' },
      { term: 'Dijkstra 알고리즘', def: '한 출발점에서 모든 정점까지의 최단 경로 — 음수 가중치 불가' },
      { term: 'Floyd 알고리즘', def: '모든 정점 쌍의 최단 경로를 구함 — 인접 행렬 3중 반복' },
      { term: 'MST(최소 신장 트리)', def: '모든 정점을 사이클 없이 연결하는 최소 비용 트리' },
      { term: '완화(Relaxation)', def: 'dist[v] > dist[u] + w(u,v)이면 dist[v] 업데이트' },
      { term: '음수 사이클', def: '가중치 합이 음수인 사이클 — 최단 경로 무한 감소' },
      { term: 'Union-Find', def: '서로소 집합 자료구조 — Kruskal MST에서 사이클 감지' },
    ],
    adt: {
      description: '가중치 그래프 ADT (그래프 ADT 확장)',
      operations: [
        { sig: 'addEdge(u, v, w)', desc: '가중치 w인 간선 추가', complexity: 'O(1)' },
        { sig: 'dijkstra(src)', desc: '단일 출발 최단 거리 배열 반환', complexity: 'O(V²)' },
        { sig: 'bellmanFord(src)', desc: '음수 가중치 포함 최단 경로', complexity: 'O(VE)' },
        { sig: 'floyd()', desc: '모든 정점 쌍의 최단 거리 행렬 반환', complexity: 'O(V³)' },
        { sig: 'kruskal()', desc: '최소 신장 트리 반환', complexity: 'O(E log E)' },
      ],
    },
    complexity: [
      { op: 'Dijkstra', avg: 'O(V²)', worst: 'O(V²)', note: '배열 기반 — 우선순위 큐 사용 시 O((V+E)logV)' },
      { op: 'Bellman-Ford', avg: 'O(VE)', worst: 'O(VE)', note: '음수 가중치 허용' },
      { op: 'Floyd', avg: 'O(V³)', worst: 'O(V³)', note: '모든 정점 쌍 최단 경로 — 3중 반복' },
      { op: 'Kruskal MST', avg: 'O(E log E)', worst: 'O(E log E)', note: '간선 정렬 + Union-Find' },
      { op: 'Prim MST', avg: 'O(V²)', worst: 'O(V²)', note: '배열 기반 — 우선순위 큐 사용 시 O((V+E)logV)' },
    ],
    representation: [
      { title: '가중 인접 행렬', desc: 'adj[u][v] = 가중치 (없으면 ∞). 공간 O(V²)' },
      { title: '가중 인접 리스트', desc: '각 노드: [(인접정점, 가중치), ...]. 공간 O(V+E)' },
    ],
    properties: [
      'Dijkstra는 음수 가중치에서 오동작 — 음수 간선이 있으면 Bellman-Ford 사용',
      'Floyd: A[i][j] = min(A[i][j], A[i][k] + A[k][j]) 를 모든 k에 대해 반복',
      'Dijkstra를 모든 정점에서 V번 돌려도 O(V³) — Floyd와 같으나 Floyd가 더 간결',
      'MST에 포함된 간선 수는 항상 V−1개',
      'Kruskal은 간선을 가중치 오름차순 정렬 후 Union-Find로 사이클을 방지',
    ],
    code: {
      python: `import heapq
from collections import defaultdict

# 인접 리스트 (가중치 포함)
graph = defaultdict(list)
edges = [(1,2,4),(1,3,1),(2,4,1),(3,2,2),(3,4,5),(4,5,3)]
for u,v,w in edges:
    graph[u].append((v,w)); graph[v].append((u,w))

# Dijkstra
def dijkstra(start, n):
    dist = [float('inf')] * (n+1)
    dist[start] = 0
    pq = [(0, start)]       # (거리, 정점)
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]: continue
        for v, w in graph[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(pq, (dist[v], v))
    return dist

print(dijkstra(1, 5))  # [inf, 0, 3, 1, 4, 7]`,
      javascript: `// 인접 리스트 (가중치 포함)
const graph = new Map();
const addEdge = (u,v,w) => {
  if(!graph.has(u))graph.set(u,[]);
  if(!graph.has(v))graph.set(v,[]);
  graph.get(u).push([v,w]); graph.get(v).push([u,w]);
};
[[1,2,4],[1,3,1],[2,4,1],[3,2,2],[3,4,5],[4,5,3]]
  .forEach(([u,v,w])=>addEdge(u,v,w));

// 간단 Dijkstra (MinHeap 미사용 — 학습용)
function dijkstra(start, V) {
  const dist = Array(V+1).fill(Infinity);
  dist[start] = 0;
  const visited = new Set();
  for(let i=0;i<V;i++){
    let u=-1;
    for(let v=1;v<=V;v++)
      if(!visited.has(v)&&(u===-1||dist[v]<dist[u]))u=v;
    visited.add(u);
    for(const[v,w] of graph.get(u)||[])
      if(dist[u]+w<dist[v])dist[v]=dist[u]+w;
  }
  return dist;
}`,
      java: `import java.util.*;

// 인접 리스트: graph.get(u) = [{이웃, 가중치}, ...]
Map<Integer,List<int[]>> graph = new HashMap<>();
int[][] edges = {{1,2,4},{1,3,1},{2,4,1},{3,2,2},{3,4,5},{4,5,3}};
for (int[] e : edges) {
    graph.computeIfAbsent(e[0], k -> new ArrayList<>()).add(new int[]{e[1], e[2]});
    graph.computeIfAbsent(e[1], k -> new ArrayList<>()).add(new int[]{e[0], e[2]});
}

// Dijkstra — 우선순위 큐로 O((V+E) log V)
static int[] dijkstra(Map<Integer,List<int[]>> g, int src, int n) {
    int[] dist = new int[n + 1];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[1] - b[1]);
    pq.offer(new int[]{src, 0});           // {정점, 거리}
    while (!pq.isEmpty()) {
        int[] cur = pq.poll();
        int u = cur[0];
        if (cur[1] > dist[u]) continue;
        for (int[] nx : g.getOrDefault(u, List.of()))
            if (dist[u] + nx[1] < dist[nx[0]]) {
                dist[nx[0]] = dist[u] + nx[1];
                pq.offer(new int[]{nx[0], dist[nx[0]]});
            }
    }
    return dist;
}`,
      cpp: `#include <vector>
#include <queue>
#include <climits>

using P = std::pair<int,int>;   // {거리, 정점}
std::vector<P> graph[6];        // graph[u] = {이웃, 가중치}

// Dijkstra — Min-Heap으로 O((V+E) log V)
std::vector<int> dijkstra(int src, int n) {
    std::vector<int> dist(n + 1, INT_MAX);
    dist[src] = 0;
    std::priority_queue<P, std::vector<P>, std::greater<P>> pq;
    pq.push({0, src});
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;
        for (auto [v, w] : graph[u])
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
    }
    return dist;
}`,
      csharp: `// 인접 리스트: graph[u] = [(이웃, 가중치), ...]
var graph = new Dictionary<int,List<(int v, int w)>>();
void AddEdge(int u, int v, int w) {
    if (!graph.ContainsKey(u)) graph[u] = new();
    if (!graph.ContainsKey(v)) graph[v] = new();
    graph[u].Add((v, w)); graph[v].Add((u, w));
}

// Dijkstra — PriorityQueue로 O((V+E) log V)
int[] Dijkstra(int src, int n) {
    var dist = new int[n + 1];
    Array.Fill(dist, int.MaxValue);
    dist[src] = 0;
    var pq = new PriorityQueue<int, int>();  // 정점, 거리
    pq.Enqueue(src, 0);
    while (pq.Count > 0) {
        int u = pq.Dequeue();
        foreach (var (v, w) in graph[u])
            if (dist[u] != int.MaxValue && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.Enqueue(v, dist[v]);
            }
    }
    return dist;
}`,
    },
    useCases: [
      { name: '내비게이션', desc: '도로 거리·소요 시간을 가중치로 두고 Dijkstra로 최단 경로를 찾습니다.' },
      { name: '네트워크 라우팅', desc: '라우터 간 전송 비용을 가중치로 두어 패킷의 최적 경로를 계산합니다.' },
      { name: '지하철 환승 최적화', desc: '역을 정점, 소요 시간을 가중치로 둬 최소 시간 경로를 안내합니다.' },
      { name: '전력·통신망 설계', desc: 'MST로 모든 지점을 최소 비용으로 잇는 망을 설계합니다.' },
    ],
    useCaseExample: {
      title: '내비게이션 최단 경로',
      desc: '교차로를 정점, 도로 길이를 가중치로 둔 그래프에서 **Dijkstra**로 출발지→목적지 최소 거리를 구합니다.',
      code: `import heapq

# 도로망: 교차로 → [(이웃 교차로, 거리)]
roads = {
    "집":     [("사거리", 4), ("공원", 2)],
    "공원":   [("사거리", 1), ("회사", 7)],
    "사거리": [("회사", 3)],
    "회사":   [],
}

def shortest(start, goal):
    dist = {start: 0}
    pq = [(0, start)]
    while pq:
        d, node = heapq.heappop(pq)
        if node == goal: return d
        for nxt, w in roads[node]:
            if d + w < dist.get(nxt, 1e9):
                dist[nxt] = d + w
                heapq.heappush(pq, (d + w, nxt))

print(shortest("집", "회사"), "km")   # 6 km (집→공원→사거리→회사)`,
    },
  },

  // ── 정렬 ─────────────────────────────────────────────────────
  {
    id: 'sorting', name: '정렬', subtitle: 'Sorting Algorithms',
    emoji: '📊', color: '#ec4899', category: 'sort',
    tagline: '데이터를 순서대로 배열하는 알고리즘 — O(n²) ~ O(n)',
    concept: [
      '**정렬(Sorting)**은 원소들을 특정 순서(오름차순·내림차순)로 재배열하는 연산입니다.',
      '비교 기반 정렬의 이론적 하한은 **O(n log n)** — 어떤 비교 정렬도 이보다 빠를 수 없습니다.',
      '비비교 기반 정렬(카운팅·기수 정렬)은 O(n)이 가능하지만 데이터 범위 제한이 있습니다.',
    ],
    keyPoints: [
      '비교 정렬 하한: O(n log n) — 결정 트리 높이 = log(n!)',
      '안정 정렬: 동일 값의 상대 순서 보존 (merge, insertion)',
      '제자리 정렬: 추가 메모리 O(1) (selection, insertion, quick, heap)',
      '퀵 정렬: 평균 O(n log n), 최악 O(n²) — 피벗 선택이 핵심',
    ],
    terminology: [
      { term: '안정 정렬(Stable)', def: '동일한 키를 가진 원소의 원래 상대 순서를 유지' },
      { term: '제자리 정렬(In-place)', def: '입력 배열 외 O(1) 추가 메모리만 사용' },
      { term: '내부 정렬', def: '모든 데이터를 메모리에 올려서 정렬' },
      { term: '외부 정렬', def: '데이터가 메모리보다 커 디스크를 활용 (병합 정렬 기반)' },
      { term: '피벗(Pivot)', def: '퀵 정렬에서 기준이 되는 원소 — 선택 방식이 성능에 영향' },
      { term: '비교 기반 정렬', def: '원소 간 비교(<, >) 연산만으로 정렬 — 하한 O(n log n)' },
    ],
    adt: {
      description: '정렬 알고리즘 비교',
      operations: [
        { sig: '버블 정렬', desc: '인접 원소 교환 반복', complexity: 'O(n²) / O(n)*' },
        { sig: '선택 정렬', desc: '최솟값을 찾아 앞으로 이동', complexity: 'O(n²)' },
        { sig: '삽입 정렬', desc: '정렬된 부분에 삽입 위치 찾기', complexity: 'O(n²) / O(n)*' },
        { sig: '합병 정렬', desc: '분할 정복, 안정, 추가 공간 O(n)', complexity: 'O(n log n)' },
        { sig: '퀵 정렬', desc: '피벗 기준 분할, 제자리', complexity: 'O(n log n) avg' },
        { sig: '힙 정렬', desc: 'Max-Heap 구성 후 반복 추출', complexity: 'O(n log n)' },
      ],
    },
    complexity: [
      { op: '버블·선택·삽입', avg: 'O(n²)', worst: 'O(n²)', note: '단순하지만 비효율 — 소규모 데이터에 사용' },
      { op: '셸 정렬', avg: 'O(n^1.5)', worst: 'O(n²)', note: '간격(gap) 부분 리스트를 삽입 정렬' },
      { op: '합병 정렬', avg: 'O(n log n)', worst: 'O(n log n)', note: '안정, 추가 메모리 O(n)' },
      { op: '퀵 정렬', avg: 'O(n log n)', worst: 'O(n²)', note: '제자리, 캐시 효율 최고' },
      { op: '힙 정렬', avg: 'O(n log n)', worst: 'O(n log n)', note: '제자리, 불안정' },
      { op: '기수 정렬', avg: 'O(dn)', worst: 'O(dn)', note: '비비교 — 자리수 d, 정수 범위 제한' },
    ],
    representation: [
      { title: '비교 기반', desc: 'O(n log n) 하한. 버블·선택·삽입·셸·합병·퀵·힙 정렬' },
      { title: '비비교 기반', desc: 'O(n) 가능. 카운팅(범위 제한), 기수(자리수), 버킷 정렬' },
    ],
    properties: [
      '비교 기반 정렬의 하한 증명: 결정 트리의 리프 수 ≥ n! → 높이 ≥ log(n!) = Θ(n log n)',
      '삽입 정렬: 거의 정렬된 데이터에서 O(n) — 실제로 소규모·부분 정렬에 강함',
      '퀵 정렬: 랜덤 피벗이나 median-of-3으로 최악 O(n²) 방지',
      'Tim Sort(Python/Java 기본): 삽입 정렬 + 합병 정렬 하이브리드 — 실전 최강',
    ],
    classification: [
      { name: '선택 정렬', desc: 'O(n²), 불안정, 제자리 — 교환 횟수가 적음' },
      { name: '버블 정렬', desc: 'O(n²), 안정, 단순 — 교육용' },
      { name: '삽입 정렬', desc: 'O(n²)/최선 O(n), 안정 — 거의 정렬된 데이터에 강함' },
      { name: '셸 정렬', desc: '평균 O(n^1.5) — 삽입 정렬을 간격(gap) 단위로 개선' },
      { name: '합병 정렬', desc: 'O(n log n), 안정, 분할 정복 — 외부 정렬' },
      { name: '퀵 정렬', desc: 'O(n log n) 평균, 제자리 — 실전 최속' },
      { name: '힙 정렬', desc: 'O(n log n), 제자리, 불안정' },
      { name: '기수 정렬', desc: 'O(dn), 비비교 — 정수 특화' },
    ],
    code: {
      python: `arr = [64, 25, 12, 22, 11]   # 시각화와 동일한 배열

def bubble(a):
    a = a[:]
    for i in range(len(a)):
        for j in range(len(a)-1-i):
            if a[j] > a[j+1]: a[j], a[j+1] = a[j+1], a[j]
    return a

def selection(a):
    a = a[:]
    for i in range(len(a)-1):
        m = i
        for j in range(i+1, len(a)):
            if a[j] < a[m]: m = j
        a[i], a[m] = a[m], a[i]
    return a

def insertion(a):
    a = a[:]
    for i in range(1, len(a)):
        key = a[i]; j = i-1
        while j >= 0 and a[j] > key:
            a[j+1] = a[j]; j -= 1
        a[j+1] = key
    return a

def quick(a, lo=0, hi=None):
    if hi is None: a = a[:]; hi = len(a)-1
    if lo >= hi: return a
    pivot = a[hi]; p = lo
    for k in range(lo, hi):
        if a[k] <= pivot: a[k], a[p] = a[p], a[k]; p += 1
    a[p], a[hi] = a[hi], a[p]
    quick(a, lo, p-1); quick(a, p+1, hi)
    return a

print("원본:  ", arr)
print("버블:  ", bubble(arr))
print("선택:  ", selection(arr))
print("삽입:  ", insertion(arr))
q = arr[:]
quick(q)
print("퀵:    ", q)`,
      javascript: `const arr = [64, 25, 12, 22, 11]; // 시각화와 동일한 배열

function bubble(a) {
  a = [...a];
  for (let i = 0; i < a.length; i++)
    for (let j = 0; j < a.length-1-i; j++)
      if (a[j] > a[j+1]) [a[j],a[j+1]] = [a[j+1],a[j]];
  return a;
}

function selection(a) {
  a = [...a];
  for (let i = 0; i < a.length-1; i++) {
    let m = i;
    for (let j = i+1; j < a.length; j++) if (a[j] < a[m]) m = j;
    [a[i],a[m]] = [a[m],a[i]];
  }
  return a;
}

function insertion(a) {
  a = [...a];
  for (let i = 1; i < a.length; i++) {
    const key = a[i]; let j = i-1;
    while (j >= 0 && a[j] > key) { a[j+1] = a[j]; j--; }
    a[j+1] = key;
  }
  return a;
}

function quick(a, lo=0, hi=a.length-1) {
  if (lo >= hi) return;
  let pivot = a[hi], p = lo;
  for (let k = lo; k < hi; k++)
    if (a[k] <= pivot) { [a[k],a[p]] = [a[p],a[k]]; p++; }
  [a[p],a[hi]] = [a[hi],a[p]];
  quick(a, lo, p-1); quick(a, p+1, hi);
}

console.log("원본:  ", arr.join(", "));
console.log("버블:  ", bubble(arr).join(", "));
console.log("선택:  ", selection(arr).join(", "));
console.log("삽입:  ", insertion(arr).join(", "));
const q = [...arr]; quick(q);
console.log("퀵:    ", q.join(", "));`,
      java: `// 버블 정렬 — 최악 O(n²), 최선 O(n)
static void bubble(int[] arr) {
    for (int i = 0; i < arr.length; i++) {
        boolean swapped = false;
        for (int j = 0; j < arr.length - i - 1; j++)
            if (arr[j] > arr[j + 1]) {
                int t = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = t;
                swapped = true;
            }
        if (!swapped) break;   // 교환 없으면 정렬 완료
    }
}

// 퀵 정렬 — 평균 O(n log n)
static void quickSort(int[] arr, int lo, int hi) {
    if (lo >= hi) return;
    int pivot = arr[hi], p = lo;
    for (int i = lo; i < hi; i++)
        if (arr[i] <= pivot) {
            int t = arr[i]; arr[i] = arr[p]; arr[p] = t; p++;
        }
    int t = arr[p]; arr[p] = arr[hi]; arr[hi] = t;
    quickSort(arr, lo, p - 1);
    quickSort(arr, p + 1, hi);
}

// 표준 라이브러리 — Arrays.sort (Dual-Pivot Quicksort / Tim Sort)`,
      cpp: `#include <algorithm>
#include <vector>

// 버블 정렬 — 최악 O(n²), 최선 O(n)
void bubble(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++)
            if (arr[j] > arr[j + 1]) {
                std::swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        if (!swapped) break;   // 교환 없으면 정렬 완료
    }
}

// 퀵 정렬 — 평균 O(n log n)
void quickSort(std::vector<int>& arr, int lo, int hi) {
    if (lo >= hi) return;
    int pivot = arr[hi], p = lo;
    for (int i = lo; i < hi; i++)
        if (arr[i] <= pivot) std::swap(arr[i], arr[p++]);
    std::swap(arr[p], arr[hi]);
    quickSort(arr, lo, p - 1);
    quickSort(arr, p + 1, hi);
}

// 표준 라이브러리 — std::sort (introsort: quick+heap+insertion)`,
      csharp: `// 버블 정렬 — 최악 O(n²), 최선 O(n)
void Bubble(int[] arr) {
    for (int i = 0; i < arr.Length; i++) {
        bool swapped = false;
        for (int j = 0; j < arr.Length - i - 1; j++)
            if (arr[j] > arr[j + 1]) {
                (arr[j], arr[j + 1]) = (arr[j + 1], arr[j]);
                swapped = true;
            }
        if (!swapped) break;   // 교환 없으면 정렬 완료
    }
}

// 퀵 정렬 — 평균 O(n log n)
void QuickSort(int[] arr, int lo, int hi) {
    if (lo >= hi) return;
    int pivot = arr[hi], p = lo;
    for (int i = lo; i < hi; i++)
        if (arr[i] <= pivot) {
            (arr[i], arr[p]) = (arr[p], arr[i]); p++;
        }
    (arr[p], arr[hi]) = (arr[hi], arr[p]);
    QuickSort(arr, lo, p - 1);
    QuickSort(arr, p + 1, hi);
}

// 표준 라이브러리 — Array.Sort (introsort)`,
    },
    useCases: [
      { name: '데이터베이스 ORDER BY', desc: '쿼리 결과를 특정 컬럼 기준으로 정렬해 반환합니다.' },
      { name: '이진 탐색 전처리', desc: '이진 탐색은 정렬된 데이터에서만 동작하므로 정렬이 선행됩니다.' },
      { name: '순위·랭킹 산출', desc: '점수·매출 등을 정렬해 순위표·리더보드를 만듭니다.' },
      { name: '외부 정렬', desc: '메모리보다 큰 파일은 조각내 정렬한 뒤 병합합니다 (외부 병합 정렬).' },
    ],
    useCaseExample: {
      title: '학생 성적 순위표',
      desc: '학생을 점수 기준 내림차순으로 정렬해 등수를 매깁니다. 실무에선 언어 내장 정렬(Tim Sort, O(n log n))을 씁니다.',
      code: `students = [
    {"name": "김철수", "score": 82},
    {"name": "이영희", "score": 95},
    {"name": "박민수", "score": 88},
]

# 점수 내림차순 정렬 (key + reverse)
ranked = sorted(students, key=lambda s: s["score"], reverse=True)

for rank, s in enumerate(ranked, start=1):
    print(f"{rank}등: {s['name']} ({s['score']}점)")
# 1등 이영희 / 2등 박민수 / 3등 김철수`,
    },
  },
]
