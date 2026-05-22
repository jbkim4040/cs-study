// CS Study — 객체지향 / Java 주제 데이터 (Java의 정석 기반)
export const CATEGORIES = [
  { id: 'basic',     label: 'Java 기초 문법', ids: ['flowcontrol', 'jvarray'] },
  { id: 'oop',       label: '객체지향',        ids: ['oopbasics'] },
  { id: 'api',       label: '예외와 핵심 클래스', ids: ['exception', 'javalang'] },
]

export const TOPICS = [
  // ── 조건문과 반복문 ───────────────────────────────────────────
  {
    id: 'flowcontrol', name: '조건문과 반복문', subtitle: 'Control Flow',
    emoji: '🔀', color: '#f59e0b', category: 'basic',
    tagline: '프로그램의 실행 흐름을 결정하는 if·switch와 for·while',
    concept: [
      '**조건문**은 조건식의 참/거짓에 따라 실행할 문장을 선택합니다. Java의 조건문은 **if문**과 **switch문** 두 가지뿐입니다.',
      '**반복문**은 특정 문장들을 반복해서 실행합니다. **for · while · do-while** 세 가지가 있으며, 반복 횟수가 중요하면 for문을, 그 외에는 while문을 주로 씁니다.',
      '**break**는 반복문이나 switch문을 즉시 빠져나오고, **continue**는 현재 반복을 건너뛰고 다음 반복으로 넘어갑니다.',
    ],
    keyPoints: [
      '조건문 = if · switch (2가지)',
      '반복문 = for · while · do-while (3가지)',
      'switch의 조건식은 int 범위 이하의 정수만 가능',
      'do-while은 블록을 최소 1번은 실행',
      'break = 탈출 / continue = 다음 반복으로',
    ],
    terminology: [
      { term: '조건식', def: '결과가 반드시 true 또는 false인 식 — 조건문·반복문의 분기 기준' },
      { term: 'if문', def: 'if · if-else · if-else if의 세 형태로 조건에 따라 문장을 실행' },
      { term: 'switch문', def: '조건식 결과와 일치하는 case로 이동 — 경우의 수가 많을 때 유용' },
      { term: 'for문', def: '초기화·조건식·증감식으로 구성 — 반복 횟수가 정해진 경우에 적합' },
      { term: 'while문', def: '조건식과 블록으로 구성 — 조건이 true인 동안 반복' },
      { term: 'do-while문', def: 'while문의 변형 — 블록을 먼저 실행한 뒤 조건을 검사(최소 1회 보장)' },
      { term: 'break문', def: '자신이 포함된 반복문 또는 switch문을 즉시 빠져나옴' },
      { term: 'continue문', def: '반복문에서 이후 문장을 건너뛰고 다음 반복으로 이동' },
    ],
    classification: [
      { name: 'if문', desc: 'if / if-else / if-else if — 조건식이 true인 블록을 실행. 가장 널리 쓰임' },
      { name: 'switch문', desc: '조건식 값과 같은 case로 점프 → break까지 실행. case 값은 리터럴·상수만' },
      { name: 'for문', desc: '초기화 → 조건식 → 문장 → 증감식 순환. 반복 횟수가 명확할 때' },
      { name: 'while문', desc: '조건식이 true인 동안 블록 반복. for문과 상호 변환 가능' },
      { name: 'do-while문', desc: '블록을 먼저 실행하고 조건 검사 → 최소 1번은 무조건 실행' },
    ],
    mechanism: {
      description: 'for문은 네 부분(초기화·조건식·문장·증감식)이 정해진 순서로 순환합니다.',
      steps: [
        { title: '① 초기화', desc: '반복에 사용할 변수를 선언·초기화 — 처음 한 번만 실행 (예: int i=1)' },
        { title: '② 조건식', desc: '결과가 true면 블록 실행, false면 for문을 종료' },
        { title: '③ 문장 실행', desc: '조건식이 true일 때 블록 안의 문장들을 수행' },
        { title: '④ 증감식', desc: '변수 값을 증가/감소시킴 (예: i++) — 이후 다시 ②로' },
        { title: '반복 또는 종료', desc: '②~④를 조건식이 false가 될 때까지 반복' },
      ],
    },
    comparison: {
      title: 'if문 vs switch문',
      headers: ['구분', 'if문', 'switch문'],
      rows: [
        ['조건식', '모든 형태의 조건식 가능', 'int 범위 이하 정수(+ 문자·문자열)'],
        ['적합한 경우', '범위 비교, 복잡한 조건', '값이 딱 떨어지는 여러 경우'],
        ['상호 변환', 'switch로 못 바꾸는 경우 많음', '항상 if로 변환 가능'],
        ['가독성', '경우가 많으면 길어짐', '경우가 많을 때 간결·효율적'],
      ],
    },
    code: {
      java: `// 조건문 — if-else if
int score = 85;
if (score >= 90)      System.out.println("A");
else if (score >= 80) System.out.println("B");
else if (score >= 70) System.out.println("C");
else                  System.out.println("F");

// 조건문 — switch
int num = 6;
switch (num) {
    case 1: System.out.println("SK");  break;
    case 6: System.out.println("KTF"); break;
    case 9: System.out.println("LG");  break;
    default: System.out.println("UNKNOWN");
}

// 반복문 — for (1~10의 합)
int sum = 0;
for (int i = 1; i <= 10; i++) {
    sum += i;            // sum = sum + i
}
System.out.println("합: " + sum);   // 55

// break / continue
for (int i = 1; i <= 10; i++) {
    if (i % 2 == 0) continue;   // 짝수는 건너뜀
    if (i > 7)      break;      // 7 초과면 탈출
    System.out.print(i + " ");  // 1 3 5 7
}`,
      pseudo: `for문 실행 순서
  1. 초기화        (한 번만)
  2. 조건식 검사 ──── false ──▶ 종료
        │ true
  3. 블록 문장 실행
  4. 증감식
        └─────────▶ 2번으로`,
    },
    useCases: [
      { name: '점수 → 학점 변환', desc: '점수 범위별로 A·B·C·D·F 학점을 매기는 로직은 if-else if 연쇄로 자연스럽게 표현됩니다.' },
      { name: '메뉴 선택 분기 처리', desc: '1·2·3·4처럼 정해진 값에 따라 다른 기능을 실행할 때 switch문이 깔끔하고 효율적입니다.' },
      { name: '구구단·누적 합 계산', desc: '정해진 횟수만큼 반복해야 할 때 for문을 씁니다. 구구단·1~n 합 같은 계산이 전형적인 예입니다.' },
      { name: '입력 검증 반복', desc: '올바른 입력이 들어올 때까지 반복해야 할 때 while문이나 do-while문으로 반복 조건을 자유롭게 설정합니다.' },
      { name: '배열·컬렉션 순회', desc: '배열의 모든 요소를 처리할 때 for(int i=0; i<arr.length; i++) 또는 향상된 for문(for-each)을 씁니다.' },
    ],
    useCaseExample: {
      title: '구구단 출력 — 중첩 for문으로 홀수 단만 선택 출력',
      desc: '2중 for문에서 바깥 루프가 단(2~9), 안쪽 루프가 곱할 수(1~9)를 담당합니다. **continue**로 짝수 단을 건너뛰는 예도 함께 보여줍니다.',
      code: `// 구구단 — 홀수 단만 출력 (continue 활용)
for (int dan = 2; dan <= 9; dan++) {
    if (dan % 2 == 0) continue;       // 짝수 단은 건너뜀

    System.out.println("--- " + dan + "단 ---");
    for (int i = 1; i <= 9; i++) {
        System.out.printf("%d × %d = %2d%n", dan, i, dan * i);
    }
}

// 1~100 합 — for문
int sum = 0;
for (int i = 1; i <= 100; i++) sum += i;
System.out.println("1~100 합: " + sum);  // 5050

// 입력 검증 — do-while (최소 1번 실행)
java.util.Scanner sc = new java.util.Scanner(System.in);
int age;
do {
    System.out.print("나이 입력(1~120): ");
    age = sc.nextInt();
} while (age < 1 || age > 120);  // 범위 벗어나면 재입력
System.out.println("입력된 나이: " + age);`,
    },
  },

  // ── 배열 ──────────────────────────────────────────────────────
  {
    id: 'jvarray', name: '배열', subtitle: 'Array',
    emoji: '🗄️', color: '#ea580c', category: 'basic',
    tagline: '같은 타입의 여러 값을 하나로 묶는 — 참조형의 첫 단추',
    concept: [
      '**배열(array)**은 같은 타입의 여러 변수를 하나의 묶음으로 다루는 자료구조입니다. 많은 양의 데이터를 다룰 때 유용하며, 각 요소는 메모리에 연속적으로 자리합니다.',
      '배열은 **참조형(reference type)**입니다. `int[] score = new int[5];`에서 변수 `score`에는 값이 아니라 배열이 생성된 **힙(heap) 메모리의 주소**가 저장됩니다.',
      '배열을 *선언*하면 배열을 다룰 참조변수만 생기고, `new`로 *생성*해야 비로소 값을 담을 공간이 힙에 만들어지며 각 요소는 타입의 기본값으로 자동 초기화됩니다.',
    ],
    keyPoints: [
      '같은 타입 + 연속된 메모리 공간',
      '배열은 참조형 — 변수엔 힙 주소가 저장됨',
      '선언(참조변수) vs 생성(new — 실제 공간)',
      '생성 시 각 요소는 기본값으로 자동 초기화',
      '배열이름.length 로 크기 확인',
    ],
    terminology: [
      { term: '배열 (Array)', def: '같은 타입의 여러 값을 하나의 이름으로 다루는 참조형 자료구조' },
      { term: '요소 (Element)', def: '배열의 각 칸. 인덱스 0번부터 시작' },
      { term: '인덱스 (Index)', def: '요소의 위치 번호 — 0 ~ (길이-1)' },
      { term: '참조형 (Reference type)', def: '값 대신 객체의 주소를 저장하는 타입 — 배열·클래스 등' },
      { term: 'length', def: '배열의 크기(요소 개수)를 알려주는 속성 — 배열이름.length' },
      { term: '다차원 배열', def: '배열의 배열 — [] 개수가 차원 수. int[][]는 2차원' },
      { term: '가변 배열 (Jagged array)', def: '다차원 배열에서 마지막 차수의 크기를 행마다 다르게 지정한 배열' },
      { term: 'System.arraycopy()', def: '배열의 일부 또는 전체를 다른 배열로 빠르게 복사하는 메서드' },
    ],
    representation: [
      { title: '선언 — int[] score;', desc: '배열을 다룰 참조변수만 생성. 아직 값을 담을 공간은 없음(null)' },
      { title: '생성 — score = new int[5];', desc: 'new가 힙에 5칸짜리 배열을 만들고, 그 주소를 score에 저장' },
      { title: '참조변수(스택) → 배열(힙)', desc: 'score 변수에는 0x100 같은 주소가, 실제 데이터는 힙의 그 주소에' },
      { title: '기본값 자동 초기화', desc: 'int 0, double 0.0, boolean false, 참조형 null 로 모든 칸이 채워짐' },
    ],
    properties: [
      '배열의 크기는 생성 시 정해지며 이후 변경할 수 없다',
      '인덱스는 0부터 시작하고, 범위를 벗어나면 ArrayIndexOutOfBoundsException 발생',
      '배열 변수는 참조형이라 메서드에 넘기면 같은 배열을 공유한다(주소 전달)',
      '`int[] a = {1,2,3};` 처럼 선언과 동시에 초기화하면 new를 생략할 수 있다',
      '가변 배열은 행마다 길이가 달라 a[i].length 가 행별로 다를 수 있다',
    ],
    mechanism: {
      description: '배열을 만들고 값을 다루는 과정은 선언 → 생성 → 초기화 → 접근 순서입니다.',
      steps: [
        { title: '선언', desc: 'int[] score; — 배열을 가리킬 참조변수를 만든다 (값 공간은 아직 없음)' },
        { title: '생성', desc: 'score = new int[5]; — 힙에 5칸을 확보하고 주소를 참조변수에 저장' },
        { title: '자동 초기화', desc: '생성 직후 모든 요소가 기본값(int는 0)으로 채워진다' },
        { title: '값 저장·접근', desc: 'score[0] = 100; 으로 저장, int v = score[0]; 으로 읽기' },
        { title: '순회', desc: 'for(int i=0; i<score.length; i++) 로 length만큼 반복' },
      ],
    },
    code: {
      java: `// 선언과 생성
int[] score;             // 선언 — 참조변수만 생성
score = new int[5];      // 생성 — 힙에 5칸 확보, 기본값 0으로 채워짐

// 선언 + 생성 + 초기화 한 줄로
int[] nums = { 100, 90, 80, 70, 60 };

// 값 저장 / 읽기
score[0] = 100;
int first = score[0];

// length로 순회
for (int i = 0; i < nums.length; i++) {
    System.out.println(nums[i]);
}

// 2차원 배열
int[][] grid = new int[3][4];   // 3행 4열
grid[1][2] = 7;

// 배열 복사
int[] copy = new int[nums.length];
System.arraycopy(nums, 0, copy, 0, nums.length);`,
    },
    useCases: [
      { name: '여러 학생의 점수 관리', desc: '학생 30명의 점수를 int[] 배열로 선언하면 하나의 이름으로 모든 점수를 순회하며 평균·최대·최소를 계산합니다.' },
      { name: '이미지의 픽셀 데이터(2차원)', desc: '너비×높이 크기의 int[][] 2차원 배열로 각 픽셀의 RGB 값을 저장하고 처리합니다.' },
      { name: '게임 보드·지도', desc: '바둑판·체스판처럼 격자형 공간은 2차원 배열로 자연스럽게 표현할 수 있고, [행][열] 인덱스로 직접 접근합니다.' },
      { name: '입력값 일괄 처리', desc: '사용자에게 여러 개의 값을 입력받아 배열에 저장한 뒤 정렬·검색·통계 처리를 수행합니다.' },
      { name: 'main(String[] args)의 명령행 인자', desc: 'java Main arg1 arg2처럼 실행하면 args[0]="arg1", args[1]="arg2"로 전달됩니다. 배열로 묶여 개수가 유동적입니다.' },
    ],
    useCaseExample: {
      title: '버블 정렬 — int[] 배열을 직접 다루는 교환 기반 정렬',
      desc: '인접한 두 요소를 비교해 큰 값을 오른쪽으로 밀어내기를 반복합니다. 배열 인덱스 조작과 두 값 교환(swap) 패턴을 익히기에 좋습니다.',
      code: `public class BubbleSort {
    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        int n = arr.length;

        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - 1 - i; j++) {
                if (arr[j] > arr[j + 1]) {   // 앞이 크면 교환
                    int tmp    = arr[j];
                    arr[j]     = arr[j + 1];
                    arr[j + 1] = tmp;
                }
            }
        }

        // 정렬 결과 출력
        for (int v : arr) System.out.print(v + " ");
        // 11 12 22 25 34 64 90
    }
}`,
    },
  },

  // ── 객체지향 (생성자와 메모리) ────────────────────────────────
  {
    id: 'oopbasics', name: '객체지향과 메모리', subtitle: 'OOP & JVM Memory',
    emoji: '🏗️', color: '#dc2626', category: 'oop',
    tagline: '클래스로 객체를 찍어내고 — 그것이 메모리에 놓이는 자리',
    concept: [
      '**객체지향**에서 **클래스**는 객체의 설계도이고, **객체(인스턴스)**는 그 설계도로 메모리에 실제로 만들어진 실체입니다. `new` 연산자가 **힙(heap)**에 인스턴스를 만듭니다.',
      '**생성자(constructor)**는 인스턴스가 생성될 때마다 호출되는 "인스턴스 초기화 메서드"입니다. 이름이 클래스와 같고 리턴값이 없으며, 모든 클래스에는 반드시 하나 이상의 생성자가 있어야 합니다.',
      'JVM은 메모리를 역할별로 나눠 씁니다 — **메서드 영역**(클래스 정보·static), **호출 스택**(메서드별 지역변수·실행), **힙**(new로 만든 모든 객체). 변수가 어디에 사는지가 동작을 결정합니다.',
    ],
    keyPoints: [
      '클래스 = 설계도 / 객체 = new로 만든 실체',
      '생성자 — 이름은 클래스와 동일, 리턴값 없음',
      '기본 생성자 — 생성자가 하나도 없으면 컴파일러가 추가',
      'JVM 메모리 = 메서드 영역 · 호출 스택 · 힙',
      'new는 힙에, 메서드 호출은 스택에 프레임을 쌓음',
    ],
    terminology: [
      { term: '클래스 (Class)', def: '객체를 만들기 위한 설계도 — 속성(필드)과 기능(메서드)을 정의' },
      { term: '객체 / 인스턴스', def: '클래스로부터 new를 통해 메모리에 실제로 생성된 실체' },
      { term: '생성자 (Constructor)', def: '인스턴스 생성 시 호출되는 초기화 메서드 — 클래스명과 동일, 리턴값 없음' },
      { term: '기본 생성자 (Default constructor)', def: '매개변수 없는 생성자 — 생성자가 하나도 없으면 컴파일러가 자동 추가' },
      { term: 'this', def: '인스턴스 자신을 가리키는 참조변수 — 인스턴스 변수와 지역변수 구분에 사용' },
      { term: 'this()', def: '생성자에서 같은 클래스의 다른 생성자를 호출 — 첫 문장에서만 가능' },
      { term: '메서드 영역 (Method Area)', def: '클래스 정보와 클래스 변수(static)가 저장되는 영역 — 클래스 로딩 시 채워짐' },
      { term: '호출 스택 (Call Stack)', def: '메서드 호출 시 프레임이 쌓이는 영역 — 지역변수·매개변수가 여기 위치' },
      { term: '힙 (Heap)', def: 'new로 생성된 모든 인스턴스(객체·배열)가 저장되는 영역' },
    ],
    representation: [
      { title: '메서드 영역 (Method Area)', desc: '클래스가 로딩될 때 클래스 정보, static 변수, 메서드 코드가 올라감. 클래스당 한 번' },
      { title: '호출 스택 (Call Stack)', desc: '메서드가 호출되면 프레임이 push되어 그 메서드의 지역변수·매개변수를 담음. 끝나면 pop' },
      { title: '힙 (Heap)', desc: 'new로 만든 인스턴스가 사는 곳. 인스턴스 변수는 여기. GC가 안 쓰는 객체를 정리' },
      { title: '참조변수 → 인스턴스', desc: '스택의 참조변수에는 주소만, 실제 객체는 힙에. 여러 참조변수가 한 객체를 가리킬 수 있음' },
    ],
    mechanism: {
      description: 'Card c = new Card(); 한 줄이 메모리에서 일어나는 일입니다.',
      steps: [
        { title: '① 참조변수 선언', desc: 'Card c — 호출 스택의 현재 프레임에 참조변수 c의 공간이 생김' },
        { title: '② new — 힙에 인스턴스 생성', desc: 'new Card()가 힙에 Card 인스턴스를 만들고 인스턴스 변수를 기본값으로 초기화' },
        { title: '③ 생성자 호출', desc: '생성자 Card()가 실행되어 인스턴스 변수를 적절한 값으로 초기화' },
        { title: '④ 주소 반환·대입', desc: 'new가 생성된 인스턴스의 주소를 반환 → 참조변수 c에 저장' },
        { title: '⑤ 사용', desc: 'c.field, c.method()로 힙의 인스턴스에 접근. 메서드 호출 시 스택에 프레임 push' },
      ],
    },
    code: {
      java: `class Car {
    String color;          // 인스턴스 변수 (힙)
    int door;
    static int count = 0;  // 클래스 변수 (메서드 영역)

    Car() {                // 기본 생성자
        this("white", 4);  // 다른 생성자 호출
    }
    Car(String color, int door) {  // 매개변수 있는 생성자
        this.color = color;   // this = 인스턴스 자신
        this.door = door;
        count++;              // 생성될 때마다 +1
    }
}

public class Main {
    public static void main(String[] args) {  // main 프레임 push
        Car c1 = new Car();          // 힙에 인스턴스, c1엔 주소
        Car c2 = new Car("red", 2);
        System.out.println(Car.count);   // 2 (메서드 영역의 static)
    }
}`,
    },
    useCases: [
      { name: '실세계 개체를 클래스로 모델링', desc: '자동차·은행 계좌·학생 같은 실세계 개체를 클래스로 표현하고, new로 여러 인스턴스를 만들어 독립적으로 상태를 관리합니다.' },
      { name: '생성된 인스턴스 수를 static으로 집계', desc: 'static 변수는 모든 인스턴스가 공유하므로, 생성자에서 count++하면 총 인스턴스 수를 추적할 수 있습니다.' },
      { name: 'this()로 생성자 코드 재사용', desc: '매개변수 없는 기본 생성자에서 this(기본값)를 호출해 초기화 코드를 한 곳에 모으고 중복을 줄입니다.' },
      { name: '스택 오버플로우·메모리 누수 이해', desc: '메서드 호출 스택 프레임과 힙 객체의 동작 원리를 이해하면 재귀 깊이 제한(StackOverflow)이나 GC가 수거 못하는 메모리 누수 원인을 파악할 수 있습니다.' },
      { name: 'GC 동작 원리의 토대', desc: '힙의 객체에 참조변수가 하나도 없으면 GC 대상이 됩니다. 언제 객체가 수거되는지 알려면 힙·스택 메모리 구조를 이해해야 합니다.' },
    ],
    useCaseExample: {
      title: 'BankAccount 클래스 — 인스턴스 변수와 static 변수 구분',
      desc: '잔액(balance)은 계좌마다 다르므로 **인스턴스 변수(힙)**, 총 계좌 수(count)는 모든 인스턴스가 공유하므로 **static 변수(메서드 영역)**입니다.',
      code: `class BankAccount {
    String owner;           // 인스턴스 변수 (힙)
    int balance;
    static int count = 0;  // 클래스 변수 (메서드 영역, 공유)

    BankAccount(String owner, int balance) {
        this.owner   = owner;   // this = 힙의 현재 인스턴스
        this.balance = balance;
        count++;                // 모든 인스턴스가 공유
    }

    void deposit(int amount)  { balance += amount; }
    void withdraw(int amount) { balance -= amount; }

    @Override
    public String toString() {
        return owner + ": " + balance + "원";
    }
}

public class Main {
    public static void main(String[] args) {
        BankAccount a = new BankAccount("김철수", 10000);
        BankAccount b = new BankAccount("이영희",  5000);
        a.deposit(3000);
        System.out.println(a);                       // 김철수: 13000원
        System.out.println(b);                       // 이영희: 5000원
        System.out.println("계좌 수: " + BankAccount.count);  // 2
    }
}`,
    },
  },

  // ── 예외 처리 ─────────────────────────────────────────────────
  {
    id: 'exception', name: '예외 처리', subtitle: 'Exception Handling',
    emoji: '🛡️', color: '#e11d48', category: 'api',
    tagline: '프로그램이 죽지 않게 — 실행 중 오류를 다루는 안전망',
    concept: [
      '프로그램 오류는 **컴파일 에러**(컴파일 시)와 **런타임 에러**(실행 시)로 나뉩니다. 런타임 오류 중 **에러(Error)**는 수습 불가능한 심각한 오류, **예외(Exception)**는 코드로 수습 가능한 오류입니다.',
      '**예외 처리**란 실행 중 발생할 예외에 대비한 코드를 미리 작성하는 것입니다. 목적은 프로그램의 비정상 종료를 막고 정상적인 실행 상태를 유지하는 것입니다.',
      '예외를 처리하려면 **try-catch문**을 씁니다. try 블록에서 예외가 나면 일치하는 catch 블록이 처리하고, **finally** 블록은 예외 발생 여부와 무관하게 항상 실행됩니다.',
    ],
    keyPoints: [
      '에러 = 수습 불가 / 예외 = 코드로 수습 가능',
      'try-catch-finally — 예외 처리 구문',
      'finally는 예외와 무관하게 항상 실행',
      '예외 계층: Object → Throwable → Exception / Error',
      'throw = 예외 발생 / throws = 메서드에 예외 선언',
    ],
    terminology: [
      { term: '에러 (Error)', def: '프로그램 코드로 수습할 수 없는 심각한 오류 (예: OutOfMemoryError)' },
      { term: '예외 (Exception)', def: '코드로 수습 가능한, 비교적 미약한 런타임 오류' },
      { term: 'try-catch문', def: '예외가 발생할 코드를 try에, 처리 코드를 catch에 작성하는 예외 처리 구문' },
      { term: 'finally 블록', def: '예외 발생 여부와 관계없이 항상 실행되는 블록 — 자원 정리에 사용' },
      { term: 'throw', def: '키워드 throw로 예외를 고의로 발생시킴 (throw new Exception())' },
      { term: 'throws', def: '메서드 선언부에 예외를 선언 — 처리하지 않고 호출한 쪽으로 떠넘김' },
      { term: 'RuntimeException', def: '프로그래머 실수로 나는 예외 — 예외 처리가 선택. NullPointerException 등' },
      { term: '예외 되던지기 (re-throwing)', def: '예외를 처리한 뒤 다시 throw해 호출한 메서드에서도 처리하게 함' },
    ],
    classification: [
      { name: 'Error (에러)', desc: 'StackOverflowError, OutOfMemoryError 등 — 코드로 수습 불가. 처리 대상 아님' },
      { name: 'Exception (일반 예외)', desc: 'IOException, ClassNotFoundException 등 — 외부 요인. 예외 처리 필수' },
      { name: 'RuntimeException', desc: 'NullPointerException, ArithmeticException 등 — 프로그래머 실수. 처리는 선택' },
    ],
    mechanism: {
      description: 'try 블록에서 예외가 발생했을 때의 처리 흐름입니다.',
      steps: [
        { title: '① 예외 발생', desc: 'try 블록 안의 문장에서 예외가 발생 — 이후 try 문장들은 건너뜀' },
        { title: '② catch 탐색', desc: '발생한 예외와 일치하는 catch 블록을 첫 번째부터 순서대로 찾음' },
        { title: '③ catch 실행', desc: '일치하는 catch 블록의 문장들을 실행 (예외 객체로 정보 접근 가능)' },
        { title: '④ finally 실행', desc: 'finally 블록이 있으면 — 예외 처리 여부와 무관하게 — 항상 실행' },
        { title: '⑤ 정상 진행', desc: 'try-catch문을 빠져나가 그 다음 문장을 계속 실행 (프로그램이 죽지 않음)' },
      ],
    },
    code: {
      java: `// try-catch-finally
public static void main(String[] args) {
    try {
        int[] arr = new int[3];
        System.out.println(arr[5]);   // 예외 발생!
        System.out.println("실행 안 됨");
    } catch (ArithmeticException e) {
        System.out.println("0으로 나눔");
    } catch (Exception e) {           // 모든 예외 — 마지막에
        System.out.println("예외: " + e.getMessage());
        e.printStackTrace();          // 호출 스택 정보 출력
    } finally {
        System.out.println("항상 실행됨");
    }
    System.out.println("프로그램 정상 종료");
}

// 예외를 고의로 발생 — throw
void check(int age) {
    if (age < 0)
        throw new IllegalArgumentException("나이는 음수 불가");
}

// 메서드에 예외 선언 — throws (호출한 쪽이 처리)
void readFile() throws java.io.IOException {
    // ...
}`,
    },
    useCases: [
      { name: '파일·네트워크 입출력 오류 대비', desc: '파일이 없거나 네트워크가 끊길 수 있으므로 IOException을 catch해서 오류 메시지를 보여주거나 재시도 로직을 실행합니다.' },
      { name: '0으로 나누기·널 참조 방지', desc: 'ArithmeticException(0 나누기)·NullPointerException은 RuntimeException으로 처리는 선택이지만, catch해 원인을 로그로 남기면 디버깅이 쉽습니다.' },
      { name: '사용자 입력 검증', desc: '잘못된 값을 받으면 throw new IllegalArgumentException("...")을 던져 호출한 곳이 적절히 처리하도록 합니다.' },
      { name: 'finally로 자원(파일·연결) 정리', desc: '파일 핸들·DB 연결은 예외가 생겨도 반드시 닫아야 합니다. finally에서 close()하면 어떤 경로로 나와도 자원이 해제됩니다.' },
      { name: '예외 메시지로 디버깅', desc: 'e.getMessage()로 원인을, e.printStackTrace()로 호출 스택을 확인해 예외가 발생한 정확한 위치를 추적합니다.' },
    ],
    useCaseExample: {
      title: 'try-with-resources — 자원을 자동으로 닫는 안전한 패턴',
      desc: 'Java 7부터 `try(자원)` 문법으로 **AutoCloseable** 자원을 선언하면 try 블록이 끝날 때 자동으로 `close()`가 호출됩니다. finally에 close()를 직접 써야 했던 번거로움이 사라집니다.',
      code: `import java.io.*;

public class SafeRead {
    public static void main(String[] args) {
        // try-with-resources: 블록이 끝나면 자동으로 reader.close()
        try (BufferedReader reader =
                 new BufferedReader(new FileReader("data.txt"))) {

            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }

        } catch (FileNotFoundException e) {
            System.err.println("파일 없음: " + e.getMessage());
        } catch (IOException e) {
            System.err.println("읽기 오류: " + e.getMessage());
            e.printStackTrace();
        }
        // reader.close()는 이미 자동 호출됨
        System.out.println("정상 종료");
    }
}`,
    },
  },

  // ── java.lang 패키지 ──────────────────────────────────────────
  {
    id: 'javalang', name: 'java.lang 패키지', subtitle: 'java.lang Package',
    emoji: '📦', color: '#7c3aed', category: 'api',
    tagline: 'import 없이 쓰는 — Object·String의 기본 클래스들',
    concept: [
      '**java.lang 패키지**는 Java 프로그래밍에 가장 기본이 되는 클래스들을 담고 있어, **import 없이도** 사용할 수 있습니다. Object·String·StringBuffer·Math·Wrapper 클래스 등이 여기 있습니다.',
      '**Object**는 모든 클래스의 최고 조상입니다. equals()·hashCode()·toString() 등 11개의 메서드를 가지며, 이 셋은 보통 적절히 **오버라이딩**해서 씁니다.',
      '**String**은 문자열을 다루는 클래스로 내용을 바꿀 수 없는 **불변(immutable)** 객체입니다. 문자열 리터럴은 상수 풀(constant pool)에서 공유되며, 잦은 변경에는 가변 클래스인 **StringBuffer**를 씁니다.',
    ],
    keyPoints: [
      'java.lang — import 없이 쓰는 기본 패키지',
      'Object — 모든 클래스의 최고 조상(11개 메서드)',
      'equals·hashCode·toString은 오버라이딩 대상',
      'String은 불변(immutable) — 리터럴은 상수 풀에서 공유',
      '잦은 문자열 변경엔 가변 클래스 StringBuffer',
    ],
    terminology: [
      { term: 'java.lang 패키지', def: 'Java의 가장 기본 클래스들이 담긴 패키지 — import 없이 사용' },
      { term: 'Object 클래스', def: '모든 클래스의 최고 조상 — 11개 메서드(equals, hashCode, toString 등) 보유' },
      { term: 'equals(Object)', def: '두 객체가 같은지 비교 — Object의 기본 구현은 주소(==) 비교' },
      { term: 'hashCode()', def: '객체의 해시코드(정수) 반환 — equals를 재정의하면 함께 재정의해야 함' },
      { term: 'toString()', def: '객체 정보를 문자열로 반환 — 보통 오버라이딩해서 의미 있는 정보 제공' },
      { term: 'String', def: '문자열을 다루는 불변(immutable) 클래스 — 내부에 char[]를 가짐' },
      { term: '상수 풀 (Constant pool)', def: '문자열 리터럴이 등록·공유되는 공간. 같은 내용 리터럴은 한 객체를 공유' },
      { term: 'StringBuffer', def: '내용을 변경할 수 있는(mutable) 문자열 클래스 — 잦은 변경에 효율적' },
      { term: 'Wrapper 클래스', def: '기본형을 객체로 감싸는 클래스 — Integer, Double, Boolean 등' },
    ],
    comparison: {
      title: 'String vs StringBuffer',
      headers: ['구분', 'String', 'StringBuffer'],
      rows: [
        ['가변성', '불변(immutable)', '가변(mutable)'],
        ['내용 변경', '새 객체가 생성됨', '같은 객체를 수정'],
        ['리터럴 공유', '상수 풀에서 공유', '항상 new로 생성'],
        ['equals()', '내용 비교 (오버라이딩됨)', '주소 비교 (오버라이딩 안 됨)'],
        ['적합한 경우', '변경이 드문 문자열', '문자열을 자주 잇거나 수정'],
      ],
    },
    properties: [
      'String 리터럴 "abc"는 상수 풀에 등록되어, 같은 내용이면 같은 객체를 공유한다 (== 가 true)',
      'new String("abc")는 항상 힙에 별도의 객체를 만든다 (리터럴과 == 가 false)',
      'String은 불변이라 + 로 이으면 새 String 객체가 계속 생성된다',
      'equals()를 오버라이딩하면 hashCode()도 함께 오버라이딩해야 한다 (같은 객체는 해시코드도 같아야)',
      'Object의 toString()은 클래스명@해시코드 형태 — 보통 의미 있게 오버라이딩한다',
    ],
    code: {
      java: `// String — 리터럴은 상수 풀에서 공유
String s1 = "abc";
String s2 = "abc";
String s3 = new String("abc");   // 힙에 별도 객체

System.out.println(s1 == s2);        // true  (같은 풀 객체)
System.out.println(s1 == s3);        // false (다른 객체)
System.out.println(s1.equals(s3));   // true  (내용 비교)

// String은 불변 — 변경하면 새 객체
String a = "Hello";
a = a + " World";   // 기존 객체는 그대로, 새 객체 생성

// 잦은 변경엔 StringBuffer (가변)
StringBuffer sb = new StringBuffer("abc");
sb.append("123");           // 같은 객체를 수정
System.out.println(sb);     // abc123

// Object 메서드 오버라이딩
class Card {
    String kind; int number;
    @Override
    public String toString() {
        return "kind: " + kind + ", number: " + number;
    }
}`,
    },
    useCases: [
      { name: '모든 클래스에서 toString()으로 디버깅', desc: 'System.out.println(obj)은 내부적으로 toString()을 호출합니다. 오버라이딩하면 객체 정보를 바로 출력할 수 있어 디버깅이 편해집니다.' },
      { name: '문자열 동등 비교(equals)', desc: 'String 비교는 ==가 아니라 equals()로 해야 합니다. ==는 참조(주소)를 비교하고, equals()는 내용을 비교합니다.' },
      { name: 'HashMap의 키 — equals/hashCode', desc: 'HashMap은 hashCode()로 버킷을 찾고 equals()로 같은 키인지 확인합니다. 두 메서드를 함께 오버라이딩하지 않으면 키 탐색이 깨집니다.' },
      { name: '문자열 누적 — StringBuffer/StringBuilder', desc: '루프에서 String +로 이어붙이면 매번 새 객체가 생겨 비효율적입니다. StringBuffer/StringBuilder의 append()로 O(n)으로 줄입니다.' },
      { name: '기본형 ↔ 객체 변환(Wrapper)', desc: 'Integer.parseInt()·valueOf()로 String·int를 변환하고, 오토박싱(int→Integer)·언박싱(Integer→int)으로 컬렉션에 기본형을 담습니다.' },
    ],
    useCaseExample: {
      title: 'equals / hashCode 함께 오버라이딩 — HashMap 키로 올바르게 쓰기',
      desc: '**equals만 오버라이딩**하면 hashCode 불일치로 HashMap에서 키를 찾지 못합니다. 같은 내용이면 같은 해시코드여야 한다는 계약을 지키려면 **두 메서드를 반드시 함께** 오버라이딩해야 합니다.',
      code: `import java.util.HashMap;

class Point {
    int x, y;
    Point(int x, int y) { this.x = x; this.y = y; }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Point)) return false;
        Point p = (Point) o;
        return x == p.x && y == p.y;
    }

    @Override
    public int hashCode() {
        return 31 * x + y;  // equals가 같으면 hashCode도 같아야 함
    }
}

public class Main {
    public static void main(String[] args) {
        HashMap<Point, String> map = new HashMap<>();
        map.put(new Point(1, 2), "서울");

        // equals+hashCode 둘 다 재정의했으므로 정상 탐색
        System.out.println(map.get(new Point(1, 2)));  // 서울
        // hashCode 없이 equals만 재정의하면 → null
    }
}`,
    },
  },
]
