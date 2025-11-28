import React from 'react';
import { motion } from 'framer-motion';

const EnvelopeDisplay = ({ letters, onSelectLetter, gridStyle = {} }) => {
  return (
    <div className="flex flex-col h-full" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="mb-4" style={{ marginBottom: '1rem' }}>
        <h2
          className="text-2xl font-bold flex items-center"
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #0d9488, #0ea5e9)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <i className="fa-solid fa-box-open mr-2"></i>信件展柜
        </h2>
        <p className="text-sm" style={{ color: '#0891b2', fontSize: '0.875rem' }}>
          点击信封查看内容
        </p>
      </div>

      <div
        className="flex-1 relative overflow-y-auto"
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          position: 'relative',
          height: '100%',
          maxHeight: '100%',
        }}
      >
        <style>{`
          @media (max-width: 768px) {
            .two-row-limit {
              max-height: 316px !important;
              height: 316px !important;
            }
          }
        `}</style>

        <div className="two-row-limit h-full">
          <div
            className="grid gap-4 p-4"
            style={{
              display: 'grid',
              gap: '1rem',
              padding: '1rem',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              boxSizing: 'border-box',
              alignItems: 'stretch',
              gridAutoRows: '1fr',
              ...gridStyle,
            }}
          >
            <style>{`
              @media (min-width: 768px) {
                .grid {
                  grid-template-columns: repeat(3, 1fr) !important;
                }
              }
              @media (max-width: 480px) {
                .grid {
                  gap: 0.5rem !important;
                  padding: 0.5rem !important;
                }
                .grid > * > div {
                  padding: 0.75rem !important;
                  aspect-ratio: 3 / 4;
                }
              }
            `}</style>

            {letters.map((letter, index) => (
              <motion.div
                key={letter.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ scale: 1.05, rotate: -1 }}
                whileTap={{ scale: 0.95 }}
                style={{ cursor: 'pointer', display: 'flex', flex: 1, minWidth: 0, width: '100%' }}
                onClick={() => onSelectLetter(letter)}
              >
                <div
                  className="p-6 rounded-lg shadow-md relative"
                  style={{
                    background: 'linear-gradient(to bottom right, white, #ecfdf5)', // emerald-50
                    padding: '1.5rem',
                    boxSizing: 'border-box',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    border: `2px solid ${letter.color || '#a7f3d0'}`, // emerald-300 fallback
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    flex: 1,
                    minHeight: 0,
                    height: '100%',
                    aspectRatio: '3 / 4',
                  }}
                >
                  <div
                    className="w-12 h-1 rounded-full self-center"
                    style={{
                      width: '3rem',
                      height: '0.25rem',
                      background: letter.color || '#10b981', // emerald-500
                      borderRadius: '9999px',
                      alignSelf: 'center'
                    }}
                  ></div>

                  <div>
                    <h3
                      className="truncate"
                      style={{
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        color: '#065f46', // emerald-800
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {letter.title}
                    </h3>
                    <p
                      className="mt-1"
                      style={{
                        fontSize: '0.875rem',
                        color: '#0d9488', // emerald-600
                        marginTop: '0.25rem'
                      }}
                    >
                      {letter.date}
                    </p>
                  </div>

                  <div className="mt-2" style={{ marginTop: '0.5rem' }}>
                    <div
                      className="h-2 rounded-full w-3/4 mx-auto mb-1"
                      style={{
                        height: '0.5rem',
                        borderRadius: '9999px',
                        width: '75%',
                        margin: '0 auto 0.25rem',
                        backgroundColor: letter.color || '#34d399'
                      }}
                    ></div>
                    <div
                      className="h-2 rounded-full w-2/3 mx-auto"
                      style={{
                        height: '0.5rem',
                        borderRadius: '9999px',
                        width: '66%',
                        margin: '0 auto',
                        backgroundColor: letter.color || '#6ee7b7'
                      }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvelopeDisplay;