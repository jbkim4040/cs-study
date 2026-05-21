export const QUIZZES = {
  flowcontrol: [
    { q: 'Java에서 제공하는 조건문은?', options: ['if문 하나뿐', 'if문과 switch문', 'if·switch·when', 'for문과 if문'], answer: 1, explanation: 'Java의 조건문은 if문과 switch문 두 가지뿐입니다. 반복문은 for·while·do-while 세 가지입니다.' },
    { q: 'switch문의 조건식에 대한 설명으로 옳은 것은?', options: ['어떤 타입이든 가능', 'int 범위 이하의 정수(및 문자·문자열)만 가능', 'boolean만 가능', '실수(double)만 가능'], answer: 1, explanation: 'switch문의 조건식은 int 범위 이하의 정수여야 합니다(문자·문자열·열거형도 가능). if문은 모든 조건식이 가능합니다.' },
    { q: 'do-while문이 while문과 다른 점은?', options: ['조건이 false면 절대 실행 안 함', '블록을 최소 1번은 반드시 실행', '무한 반복만 가능', '조건식이 필요 없음'], answer: 1, explanation: 'do-while문은 블록을 먼저 실행한 뒤 조건을 검사하므로, 조건과 무관하게 최소 1번은 실행됩니다.' },
    { q: 'break문과 continue문의 차이로 옳은 것은?', options: ['둘 다 반복문을 완전히 종료', 'break=반복문 탈출, continue=다음 반복으로 건너뜀', 'break=다음 반복, continue=탈출', '둘 다 프로그램을 종료'], answer: 1, explanation: 'break는 반복문/switch를 즉시 빠져나오고, continue는 이후 문장을 건너뛰고 다음 반복으로 넘어갑니다.' },
    { q: 'for문의 실행 순서로 옳은 것은?', options: ['초기화 → 증감식 → 조건식 → 문장', '초기화 → 조건식 → 문장 → 증감식', '조건식 → 초기화 → 문장 → 증감식', '문장 → 조건식 → 초기화 → 증감식'], answer: 1, explanation: '초기화는 한 번만, 이후 조건식 검사 → (true면) 문장 실행 → 증감식 → 다시 조건식 순으로 반복합니다.' },
  ],
  jvarray: [
    { q: '배열은 참조형입니다. int[] score = new int[5]; 에서 변수 score에 저장되는 것은?', options: ['5개의 정수값', '배열이 생성된 힙 메모리의 주소', '배열의 크기 5', '항상 0'], answer: 1, explanation: '배열은 참조형이라 변수 score에는 값이 아니라 배열이 생성된 힙 메모리의 주소가 저장됩니다.' },
    { q: '배열의 선언(int[] a;)과 생성(a = new int[5];)의 차이는?', options: ['선언이 곧 생성이다', '선언은 참조변수만, 생성(new)이 실제 값 공간을 만든다', '생성이 먼저, 선언이 나중', '선언만으로 값을 저장할 수 있다'], answer: 1, explanation: '선언은 배열을 다룰 참조변수만 만듭니다. new로 생성해야 값을 담을 공간이 힙에 만들어집니다.' },
    { q: '배열의 크기를 알려주는 것은?', options: ['배열이름.size()', '배열이름.length', '배열이름.count', 'length(배열이름)'], answer: 1, explanation: '배열의 크기는 length 속성으로 얻습니다 (예: score.length). 메서드가 아닌 속성이라 괄호가 없습니다.' },
    { q: '배열에서 인덱스 범위를 벗어나 접근하면?', options: ['0이 반환된다', 'null이 반환된다', 'ArrayIndexOutOfBoundsException이 발생', '자동으로 배열이 커진다'], answer: 2, explanation: '인덱스는 0~(길이-1)입니다. 범위를 벗어나면 ArrayIndexOutOfBoundsException 예외가 발생합니다.' },
    { q: 'new int[3]으로 생성한 배열의 각 요소 초기값은?', options: ['쓰레기값', '0', 'null', '1'], answer: 1, explanation: '배열을 생성하면 각 요소가 타입의 기본값으로 자동 초기화됩니다. int는 0, boolean은 false, 참조형은 null입니다.' },
  ],
  oopbasics: [
    { q: '생성자(constructor)의 특징으로 옳은 것은?', options: ['이름은 자유롭게 짓고 리턴값이 있다', '이름이 클래스와 같고 리턴값이 없다', 'void를 반드시 붙인다', '클래스당 하나만 가능'], answer: 1, explanation: '생성자는 이름이 클래스 이름과 같아야 하고 리턴값이 없습니다(void도 안 씀). 오버로딩으로 여러 개 가질 수 있습니다.' },
    { q: '기본 생성자(default constructor)에 대한 설명으로 옳은 것은?', options: ['항상 컴파일러가 추가한다', '생성자가 하나도 없을 때만 컴파일러가 추가한다', '직접 만들 수 없다', '매개변수가 있다'], answer: 1, explanation: '클래스에 생성자가 하나도 없으면 컴파일러가 매개변수 없는 기본 생성자를 추가합니다. 생성자가 하나라도 있으면 추가하지 않습니다.' },
    { q: 'new 연산자로 생성된 인스턴스가 저장되는 JVM 메모리 영역은?', options: ['호출 스택(Call Stack)', '메서드 영역(Method Area)', '힙(Heap)', 'PC 레지스터'], answer: 2, explanation: 'new로 생성된 모든 인스턴스(객체·배열)는 힙(Heap)에 저장됩니다. 인스턴스 변수도 힙에 위치합니다.' },
    { q: '메서드가 호출될 때 그 메서드의 지역변수·매개변수가 저장되는 곳은?', options: ['힙(Heap)', '메서드 영역(Method Area)', '호출 스택(Call Stack)의 프레임', '상수 풀'], answer: 2, explanation: '메서드가 호출되면 호출 스택에 프레임이 push되고, 그 안에 지역변수·매개변수가 저장됩니다. 메서드가 끝나면 프레임이 pop됩니다.' },
    { q: '참조변수 this의 역할로 옳은 것은?', options: ['클래스 자신을 가리킴', '인스턴스 자신을 가리키며, 인스턴스 변수와 지역변수를 구분', '부모 클래스를 가리킴', 'static 변수를 가리킴'], answer: 1, explanation: 'this는 인스턴스 자신을 가리키는 참조변수입니다. 매개변수와 인스턴스 변수의 이름이 같을 때 this.field로 구분합니다.' },
  ],
  exception: [
    { q: '에러(Error)와 예외(Exception)의 차이로 옳은 것은?', options: ['둘 다 컴파일 시 발생', '에러=코드로 수습 불가, 예외=코드로 수습 가능', '예외가 에러보다 심각하다', '에러만 처리할 수 있다'], answer: 1, explanation: '에러는 OutOfMemoryError처럼 코드로 수습할 수 없는 심각한 오류, 예외는 코드(try-catch)로 수습 가능한 오류입니다. 둘 다 런타임에 발생합니다.' },
    { q: 'finally 블록에 대한 설명으로 옳은 것은?', options: ['예외가 발생할 때만 실행', '예외가 없을 때만 실행', '예외 발생 여부와 무관하게 항상 실행', 'catch가 없으면 실행 안 됨'], answer: 2, explanation: 'finally 블록은 예외 발생 여부와 관계없이 항상 실행됩니다. try나 catch에서 return을 만나도 실행됩니다 — 자원 정리에 쓰입니다.' },
    { q: 'try 블록에서 예외가 발생했을 때의 흐름으로 옳은 것은?', options: ['프로그램이 즉시 종료된다', '일치하는 catch 블록을 찾아 처리하고 try-catch 이후를 계속 실행', '예외 이후의 try 문장도 모두 실행된다', 'finally를 건너뛴다'], answer: 1, explanation: '예외 발생 시 이후 try 문장은 건너뛰고, 일치하는 catch를 찾아 처리한 뒤 (finally 실행 후) try-catch 다음 문장을 계속 실행합니다.' },
    { q: 'throw와 throws의 차이로 옳은 것은?', options: ['같은 것이다', 'throw=예외를 발생시킴, throws=메서드에 예외를 선언', 'throw=메서드 선언, throws=예외 발생', '둘 다 예외를 처리한다'], answer: 1, explanation: 'throw는 키워드로 예외를 직접 발생시키고(throw new Exception()), throws는 메서드 선언부에 예외를 선언해 호출한 쪽으로 처리를 떠넘깁니다.' },
    { q: '모든 예외 클래스의 최고 조상은?', options: ['Exception', 'Throwable', 'RuntimeException', 'Error'], answer: 1, explanation: '계층은 Object → Throwable → Exception / Error 입니다. Throwable이 Exception과 Error의 공통 조상입니다.' },
  ],
  javalang: [
    { q: 'java.lang 패키지의 클래스를 사용할 때 import는?', options: ['반드시 import해야 한다', 'import 없이 사용할 수 있다', 'String만 import 불필요', 'import는 컴파일 에러를 낸다'], answer: 1, explanation: 'java.lang은 가장 기본이 되는 패키지라 import 없이 사용할 수 있습니다. Object·String·Math 등이 여기 속합니다.' },
    { q: 'Object 클래스에 대한 설명으로 옳은 것은?', options: ['java.util 패키지에 있다', '모든 클래스의 최고 조상이다', '인스턴스를 만들 수 없다', 'String의 자식 클래스다'], answer: 1, explanation: 'Object는 모든 클래스의 최고 조상으로, equals()·hashCode()·toString() 등 11개의 메서드를 가집니다.' },
    { q: 'String 객체의 특징으로 옳은 것은?', options: ['내용을 자유롭게 변경할 수 있다', '내용을 변경할 수 없는 불변(immutable) 객체다', '기본형이다', 'new로만 생성할 수 있다'], answer: 1, explanation: 'String은 불변(immutable) 객체라 한 번 만들어진 내용을 바꿀 수 없습니다. + 로 이으면 새 String 객체가 생성됩니다.' },
    { q: 'String s1="abc"; String s2="abc"; 일 때 s1==s2 의 결과는?', options: ['false', 'true', '컴파일 에러', '실행마다 다름'], answer: 1, explanation: '문자열 리터럴은 상수 풀(constant pool)에 등록되어 공유됩니다. s1과 s2는 같은 풀 객체를 가리키므로 == 가 true입니다. (new String("abc")는 별도 객체)' },
    { q: '문자열을 자주 변경(추가·수정)해야 할 때 적합한 클래스는?', options: ['String', 'StringBuffer', 'Object', 'Integer'], answer: 1, explanation: 'String은 불변이라 변경할 때마다 새 객체가 생성됩니다. 잦은 변경에는 가변(mutable) 클래스인 StringBuffer(또는 StringBuilder)가 효율적입니다.' },
  ],
}
