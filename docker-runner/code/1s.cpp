

#define N (1024*1024*10/4)
int X[N]; // 1M

int main(){

    for (int i = 0 ; i < 10000 ; ++i)
        for (int j = 0 ; j < 10000 ; ++j)
            X[i*j%N] = i*j;

}

