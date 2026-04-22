import { useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

const GRID_SIZE = 4;
const EMPTY_TILE = 0;
const SOLVED_BOARD = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) =>
  index === GRID_SIZE * GRID_SIZE - 1 ? EMPTY_TILE : index + 1
);

function isSolved(board: number[]) {
  return board.every((value, index) => value === SOLVED_BOARD[index]);
}

function getInversionCount(values: number[]) {
  const tiles = values.filter((value) => value !== EMPTY_TILE);
  let inversions = 0;

  for (let index = 0; index < tiles.length; index += 1) {
    for (let nextIndex = index + 1; nextIndex < tiles.length; nextIndex += 1) {
      if (tiles[index] > tiles[nextIndex]) {
        inversions += 1;
      }
    }
  }

  return inversions;
}

function isSolvable(board: number[]) {
  const inversions = getInversionCount(board);
  const emptyIndex = board.indexOf(EMPTY_TILE);
  const emptyRowFromBottom = GRID_SIZE - Math.floor(emptyIndex / GRID_SIZE);

  if (GRID_SIZE % 2 !== 0) {
    return inversions % 2 === 0;
  }

  if (emptyRowFromBottom % 2 === 0) {
    return inversions % 2 !== 0;
  }

  return inversions % 2 === 0;
}

function shuffleBoard() {
  const board = [...SOLVED_BOARD];

  do {
    for (let index = board.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [board[index], board[randomIndex]] = [board[randomIndex], board[index]];
    }
  } while (isSolved(board) || !isSolvable(board));

  return board;
}

function canMove(board: number[], tileIndex: number) {
  const emptyIndex = board.indexOf(EMPTY_TILE);
  const tileRow = Math.floor(tileIndex / GRID_SIZE);
  const tileColumn = tileIndex % GRID_SIZE;
  const emptyRow = Math.floor(emptyIndex / GRID_SIZE);
  const emptyColumn = emptyIndex % GRID_SIZE;

  return Math.abs(tileRow - emptyRow) + Math.abs(tileColumn - emptyColumn) === 1;
}

export default function GameScreen() {
  const router = useRouter();
  const [board, setBoard] = useState<number[]>(() => shuffleBoard());
  const [moves, setMoves] = useState(0);
  const solved = useMemo(() => isSolved(board), [board]);

  const restartGame = () => {
    setBoard(shuffleBoard());
    setMoves(0);
  };

  const handleTilePress = (tileIndex: number) => {
    if (!canMove(board, tileIndex) || solved) {
      return;
    }

    const emptyIndex = board.indexOf(EMPTY_TILE);
    const nextBoard = [...board];
    [nextBoard[tileIndex], nextBoard[emptyIndex]] = [nextBoard[emptyIndex], nextBoard[tileIndex]];

    setBoard(nextBoard);
    setMoves((currentMoves) => currentMoves + 1);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
            <Text style={styles.secondaryButtonText}>Назад</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={restartGame}>
            <Text style={styles.secondaryButtonText}>Перемішати</Text>
          </Pressable>
        </View>

        <View style={styles.hero}>
          <Text style={styles.kicker}>Sliding Puzzle</Text>
          <Text style={styles.title}>Збери поле від 1 до 15</Text>
          <Text style={styles.subtitle}>
            Натискай на плитку поруч із порожньою клітинкою, щоб пересунути її на вільне місце.
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Ходи</Text>
            <Text style={styles.statValue}>{moves}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Статус</Text>
            <Text style={styles.statValue}>{solved ? 'Готово' : 'У грі'}</Text>
          </View>
        </View>

        <View style={styles.board}>
          {board.map((tile, index) => {
            const movable = tile !== EMPTY_TILE && canMove(board, index);
            const isEmpty = tile === EMPTY_TILE;

            return (
              <Pressable
                key={index}
                style={[
                  styles.tile,
                  movable && styles.tileMovable,
                  isEmpty && styles.tileEmpty,
                ]}
                onPress={() => handleTilePress(index)}
                disabled={isEmpty}
              >
                {!isEmpty && <Text style={styles.tileText}>{tile}</Text>}
              </Pressable>
            );
          })}
        </View>

        <View style={styles.footerCard}>
          <Text style={styles.footerTitle}>{solved ? 'Пазл зібрано' : 'Проєкт ініціалізовано'}</Text>
          <Text style={styles.footerText}>
            Маємо готовий старт: маршрути працюють, екран гри є, базова механіка вже на місці. Наступним кроком
            можна додати таймер, рівні складності або збереження прогресу.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#020617',
  },
  screen: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#0f172a',
  },
  secondaryButtonText: {
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '700',
  },
  hero: {
    gap: 8,
  },
  kicker: {
    color: '#60a5fa',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    color: '#f8fafc',
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800',
  },
  subtitle: {
    color: '#cbd5e1',
    fontSize: 15,
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 13,
    marginBottom: 6,
  },
  statValue: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '800',
  },
  board: {
    aspectRatio: 1,
    borderRadius: 28,
    padding: 12,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tile: {
    width: '23.5%',
    aspectRatio: 1,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileMovable: {
    backgroundColor: '#2563eb',
  },
  tileEmpty: {
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  tileText: {
    color: '#eff6ff',
    fontSize: 26,
    fontWeight: '800',
  },
  footerCard: {
    borderRadius: 24,
    padding: 18,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    gap: 8,
  },
  footerTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '800',
  },
  footerText: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 21,
  },
});
