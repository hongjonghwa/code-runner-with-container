# 출력을 원할 경우 print() 함수 활용
# 예시) print(df.head())

# getcwd(), chdir() 등 작업 폴더 설정 불필요
# 파일 경로 상 내부 드라이브 경로(C: 등) 접근 불가

# 데이터 파일 읽기 예제
import pandas as pd
a = pd.read_csv('data/mtcars.csv', index_col=0)

# 사용자 코딩

# 답안 제출 예시
# print(평균변수값)
