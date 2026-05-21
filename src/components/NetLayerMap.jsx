// 네트워크 주제 페이지 상단에 표시되는 TCP/IP 계층 위치 안내
const LAYERS = [
  { cat: 'application', name: '응용 계층',     protos: 'HTTP · DNS · SMTP · FTP', topicId: 'application' },
  { cat: 'transport',   name: '전송 계층',     protos: 'TCP · UDP',               topicId: 'transport' },
  { cat: 'network',     name: '네트워크 계층', protos: 'IP · ICMP · ARP',          topicId: 'icmp' },
  { cat: 'link',        name: '데이터 링크 계층', protos: '이더넷 · Wi-Fi',        topicId: null },
  { cat: 'physical',    name: '물리 계층',     protos: '케이블 · 광섬유 · 전파',    topicId: null },
]

export default function NetLayerMap({ category, color, onSelect }) {
  return (
    <div className="layer-map" style={{ '--color': color }}>
      <div className="layer-map-head">
        🗺️ TCP/IP 5계층 모델 <span>— 지금 보는 프로토콜이 어느 계층에 있는지 확인하세요</span>
      </div>
      <div className="layer-stack">
        {LAYERS.map(l => {
          const active = l.cat === category
          const nav = !!l.topicId && !active
          return (
            <button
              key={l.cat}
              type="button"
              className={'layer-row' + (active ? ' active' : '') + (l.topicId ? '' : ' out')}
              onClick={nav ? () => onSelect?.(l.topicId) : undefined}
              disabled={!l.topicId}
            >
              <span className="layer-name">{l.name}</span>
              <span className="layer-protos">{l.protos}</span>
              {active
                ? <span className="layer-here">● 현재 위치</span>
                : nav
                  ? <span className="layer-go">바로가기 →</span>
                  : <span className="layer-tag">학습 범위 밖</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
