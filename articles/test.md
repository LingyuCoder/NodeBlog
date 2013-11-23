## ZOJ 1091 Knight Moves ##
>**题意**：骑士遍历，给源点、目标点，求源点到目标点的最短步数
>
>**解法**：经典bfs
>
>**吐槽** :一直想用双向bfs写一次，不过这两天各种屁事。这题完全就是C++版本的翻译...熟悉了一下python的队列实现和矩阵，还是挺有收获的，发现我特别依赖字典，这样不好不好


    import sys
    des=[[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]]
    def bfs(start,end):
        q=[]
        flag = [([0] * 11) for i in range(11)]
        q.append(start)
        flag[start['x']][start['y']]=1
        while len(q):
            cur=q[0]
            q=q[1:]
            if cur['x']==end['x'] and cur['y']==end['y']:
                return cur
            for i in range(len(des)):
                curx=des[i][0]+cur['x']
                cury=des[i][1]+cur['y']            
                if curx<=8 and curx>=1 and cury<=8 and cury>=1 and flag[curx][cury]==0:
                    flag[curx][cury]=1
                    q.append({'x':curx,'y':cury,'t':cur['t']+1})
    
    for line in sys.stdin:
        a=line.rstrip().split()
        start={'x':ord(a[0][0])-ord('a')+1,'y':ord(a[0][1])-ord('0'),'t':0}
        end={'x':ord(a[1][0])-ord('a')+1,'y':ord(a[1][1])-ord('0'),'t':0}
        ans=bfs(start,end)
        print 'To get from %s to %s takes %d knight moves.' %(a[0],a[1],ans['t'])