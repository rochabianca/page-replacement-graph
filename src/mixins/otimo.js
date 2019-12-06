Otimo(frames){
      let pages = [];
      for(let i=0 ; i<this.algorithmArray.length; i++){
        let a = parseInt(this.algorithmArray[i].replace(/[^0-9]/g,''));
        pages.push(a);
      }
      let acertos=0, temp = [], flag1, flag2, flag3, pos, max, faults = 0;
    for(let i = 0; i < frames; ++i){
        frames[i] = -1;
    }
    for(let i = 0; i < this.algorithmArray.length; ++i){
        flag1 = flag2 = 0;
        for(let j = 0; j < frames; ++j){
          if(frames[j] == pages[i]){
                flag1 = flag2 = 1;
              }
        }
        if(flag1 == 0){
            for(let j = 0; j < frames; ++j){
                if(frames[j] == -1){
                    faults++;
                    frames[j] = pages[i];
                    flag2 = 1;
                }
            }    
            acertos++;
        }
        
        if(flag2 == 0){
        	flag3=0;
            for(let j = 0; j < frames; ++j){
            	temp[j] = -1;
            	for(let k = i + 1; k < this.algorithmArray.length; ++k){
            		if(frames[j] == pages[k]){
                  temp[j] = k; 
            		}
            	}
            }
            
            for(let j = 0; j < frames; ++j){
            	if(temp[j] == -1){
            		pos = j;
            		flag3 = 1;
            	}
            }
            
            if(flag3 ==0){
            	max = temp[0];
            	pos = 0;
            	for(let j = 1; j < frames; ++j){
            		if(temp[j] > max){
            			max = temp[j];
            			pos = j;
            		}
            	}            	
            }
			
			    frames[pos] = pages[i];
			    faults++;
        }
        for(let j = 0; j < frames; j++){
          console.log("%d\t", frames[j]);
        }
    }
    console.log("\n\nTotal Page Faults = %d", faults);
    console.log("\n\nTotal acertos = %d", acertos);
      return acertos;
    }