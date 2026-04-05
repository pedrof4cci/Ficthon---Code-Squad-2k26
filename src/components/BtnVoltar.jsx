export default function BtnVoltar({ onClick, style = {} }) {
  return (
    <button onClick={onClick} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }}>
      <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
        <path d="M9 1L1 9L9 17" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  )
}
