function supprdoublonetcoupe(nom,centres,nblignes,nbcols)

newcentre = [];
for i = 1:length(centres)
    
    centre = centres(i,:)
  x = centre(1);
    y = centre(2);
   
    if ((x > (nblignes/2) && x < (3/2 * nblignes) && y>(nbcols/2) && y< (3/2*nbcols)))
        centre
        newcentre =[newcentre; [x,y]];
        
    else
        delete(nom+'/pierre' + i + '.png');
    end

end

length(newcentre)
fid = fopen(nom +"/centrebis"+ nom +".json",'w');
fprintf(fid,'[');
premier = true;
for i = 1:length(newcentre)
    coinhautgauche = newcentre(i,:);
    coinhautgauche1 = coinhautgauche(1)-round(nblignes/2);
    coinhautgauche2 = coinhautgauche(2)-round(nbcols/2);
    if(~premier)
        fprintf(fid, ',');
    end
    fprintf(fid,'[%i', coinhautgauche1);
    fprintf(fid,',');
    fprintf(fid,'%i ]',coinhautgauche2);
    premier = false;

end
fprintf(fid,']');
fclose(fid);

end